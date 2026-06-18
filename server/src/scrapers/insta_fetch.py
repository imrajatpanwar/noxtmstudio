#!/usr/bin/env python3
"""
Instaloader-based Instagram data fetcher.
Called from Node.js via child_process.
Outputs JSON to stdout.

Usage: python3 insta_fetch.py <handle> [--competitors comp1,comp2] [--ig-user xxx] [--ig-pass xxx]
"""

import sys
import json
import argparse
from datetime import datetime, timezone
import instaloader

def fetch_profile(L, username):
    """Fetch full profile + post data for a username."""
    try:
        profile = instaloader.Profile.from_username(L.context, username)
    except instaloader.exceptions.ProfileNotExistsException:
        return {"error": f"Profile @{username} not found"}
    except Exception as e:
        return {"error": str(e)}

    data = {
        "handle": profile.username,
        "name": profile.full_name,
        "bio": profile.biography or "",
        "followers": profile.followers,
        "following": profile.followees,
        "postCount": profile.mediacount,
        "isPrivate": profile.is_private,
        "isVerified": profile.is_verified,
        "profilePic": profile.profile_pic_url,
        "externalUrl": profile.external_url or "",
        "businessCategory": profile.business_category_name or "",
    }

    if profile.is_private:
        data["posts"] = []
        data["hashtags"] = {}
        data["postingPattern"] = {}
        return data

    # Fetch recent posts (up to 20)
    posts = []
    hashtag_count = {}
    post_hours = {}
    post_weekdays = {}

    try:
        for i, post in enumerate(profile.get_posts()):
            if i >= 20:
                break

            post_data = {
                "index": i + 1,
                "shortcode": post.shortcode,
                "url": f"https://www.instagram.com/p/{post.shortcode}/",
                "type": "reel" if post.is_video and post.video_view_count else ("video" if post.is_video else "image"),
                "date": post.date_utc.isoformat(),
                "dateFormatted": post.date_utc.strftime("%b %d, %Y"),
                "likes": post.likes,
                "comments": post.comments,
                "views": post.video_view_count or 0,
                "caption": (post.caption or "")[:300],
                "hashtags": list(post.caption_hashtags) if post.caption_hashtags else [],
                "isSponsored": post.is_sponsored,
            }

            # Engagement rate per post
            if data["followers"] > 0:
                eng = (post.likes + post.comments) / data["followers"] * 100
                post_data["engRate"] = round(eng, 2)

            posts.append(post_data)

            # Track hashtags
            for tag in (post.caption_hashtags or []):
                hashtag_count[tag] = hashtag_count.get(tag, 0) + 1

            # Track posting times
            hour = post.date_utc.hour
            post_hours[hour] = post_hours.get(hour, 0) + 1

            weekday = post.date_utc.strftime("%A")
            post_weekdays[weekday] = post_weekdays.get(weekday, 0) + 1

    except Exception as e:
        data["postFetchError"] = str(e)

    data["posts"] = posts

    # Engagement summary
    if posts:
        total_likes = sum(p["likes"] for p in posts)
        total_comments = sum(p["comments"] for p in posts)
        total_views = sum(p["views"] for p in posts if p["views"])
        view_posts = [p for p in posts if p["views"]]

        data["engagement"] = {
            "avgLikes": round(total_likes / len(posts)),
            "avgComments": round(total_comments / len(posts)),
            "avgViews": round(total_views / len(view_posts)) if view_posts else 0,
            "totalLikes": total_likes,
            "totalComments": total_comments,
            "engagementRate": round((total_likes + total_comments) / len(posts) / max(data["followers"], 1) * 100, 3),
            "bestPost": max(posts, key=lambda p: p["likes"] + p["comments"])["index"] if posts else None,
            "worstPost": min(posts, key=lambda p: p["likes"] + p["comments"])["index"] if posts else None,
        }

        # Posting frequency
        dates = sorted([datetime.fromisoformat(p["date"]) for p in posts])
        if len(dates) >= 2:
            day_span = (dates[-1] - dates[0]).days or 1
            data["engagement"]["postsPerWeek"] = round(len(dates) / day_span * 7, 1)
        else:
            data["engagement"]["postsPerWeek"] = 0

        # Reel vs image ratio
        reels = sum(1 for p in posts if p["type"] == "reel")
        data["engagement"]["reelRatio"] = f"{reels}/{len(posts)}"

    # Hashtag analysis
    top_hashtags = sorted(hashtag_count.items(), key=lambda x: -x[1])[:15]
    data["hashtags"] = {
        "topUsed": [{"tag": t, "count": c} for t, c in top_hashtags],
        "uniqueCount": len(hashtag_count),
        "avgPerPost": round(sum(len(p.get("hashtags", [])) for p in posts) / max(len(posts), 1), 1),
    }

    # Posting pattern
    best_hour = max(post_hours, key=post_hours.get) if post_hours else None
    best_day = max(post_weekdays, key=post_weekdays.get) if post_weekdays else None
    data["postingPattern"] = {
        "byHour": dict(sorted(post_hours.items())),
        "byWeekday": post_weekdays,
        "bestHour": best_hour,
        "bestDay": best_day,
    }

    return data


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("handle", help="Instagram handle to audit")
    parser.add_argument("--competitors", default="", help="Comma-separated competitor handles")
    parser.add_argument("--ig-user", default="", help="Instagram login username")
    parser.add_argument("--ig-pass", default="", help="Instagram login password")
    args = parser.parse_args()

    L = instaloader.Instaloader(
        download_pictures=False,
        download_videos=False,
        download_video_thumbnails=False,
        download_geotags=False,
        download_comments=False,
        save_metadata=False,
        compress_json=False,
        quiet=True,
    )

    # Login if credentials provided
    if args.ig_user and args.ig_pass:
        try:
            L.login(args.ig_user, args.ig_pass)
        except Exception as e:
            print(json.dumps({"error": f"Login failed: {str(e)}"}))
            sys.exit(1)

    result = {"target": None, "competitors": [], "scraped": True}

    # Fetch main profile
    result["target"] = fetch_profile(L, args.handle)
    if "error" in result["target"]:
        result["scraped"] = False
        print(json.dumps(result))
        return

    # Fetch competitors
    if args.competitors:
        for comp in args.competitors.split(","):
            comp = comp.strip().lstrip("@")
            if comp:
                comp_data = fetch_profile(L, comp)
                comp_data["_handle"] = comp
                result["competitors"].append(comp_data)

    print(json.dumps(result, default=str))


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Ensure sitemap URLs exist and lastmod reflects each page's latest Git change."""

from datetime import date
from pathlib import Path
import subprocess
import sys
from urllib.parse import unquote, urlparse
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / "sitemap.xml"
SITE_HOST = "iwannaberich.xyz"
NS = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}


def fail(message: str) -> None:
    print(f"FAIL: {message}", file=sys.stderr)
    raise SystemExit(1)


try:
    sitemap = ET.parse(SITEMAP).getroot()
except (ET.ParseError, OSError) as error:
    fail(f"could not read sitemap.xml: {error}")

urls = sitemap.findall("sm:url", NS)
if not urls:
    fail("sitemap.xml contains no URLs")

seen = set()
for entry in urls:
    location = entry.findtext("sm:loc", namespaces=NS)
    lastmod = entry.findtext("sm:lastmod", namespaces=NS)
    if not location or not lastmod:
        fail("every sitemap URL must include loc and lastmod")

    parsed = urlparse(location)
    if parsed.scheme != "https" or parsed.netloc != SITE_HOST or parsed.query or parsed.fragment:
        fail(f"unexpected sitemap location: {location}")
    if location in seen:
        fail(f"duplicate sitemap location: {location}")
    seen.add(location)

    relative = unquote(parsed.path.lstrip("/")) or "index.html"
    page = (ROOT / relative).resolve()
    if ROOT not in page.parents or not page.is_file() or page.suffix.lower() != ".html":
        fail(f"sitemap URL does not map to a tracked HTML page: {location}")

    try:
        date.fromisoformat(lastmod)
    except ValueError:
        fail(f"invalid lastmod date for {location}: {lastmod}")

    result = subprocess.run(
        ["git", "log", "-1", "--format=%cs", "HEAD", "--", relative],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    latest_change = result.stdout.strip()
    if not latest_change:
        fail(f"no Git history found for {relative}")
    if lastmod != latest_change:
        fail(f"{location} lastmod is {lastmod}, latest page change is {latest_change}")

    print(f"OK {location} ({lastmod})")

print(f"OK: checked {len(urls)} sitemap URLs")

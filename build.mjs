// Static builder for steadyfetch.com (hosted on GitHub Pages) — run `node build.mjs`, commit the output.
// Every price below was read on 2 September 2026 from the public Apify store API
// (pricingInfos, latest entry already in effect; FREE-plan and GOLD-plan tiers) or the vendor's own pricing page.
import { writeFileSync, mkdirSync } from "node:fs";

const SITE = "https://steadyfetch.com";
const CHECKED = "2 September 2026";
const ISO = "2026-09-02";
const store = (slug) => `https://apify.com/steadyfetch/${slug}`;
const mcp = (slug) => `https://mcp.apify.com?tools=steadyfetch/${slug}`;
const tpl = (file) => `https://github.com/steadyfetch/n8n-templates/blob/master/${file}`;
const perK = (v) => (v == null ? "—" : "$" + (v * 1000).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
const usd = (v) => "$" + v.toLocaleString("en-US", { maximumFractionDigits: 5 });
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------- OUR ACTORS (FREE-plan / Business-plan price per unit, live Sep-1) ----------
const OURS = {
  "facebook-ads-transcript-scraper": { name: "Facebook Ad Library transcripts", unit: "ad creative", free: 0.02, gold: 0.01, extra: "+ $0.005 per minute beyond the first 3 minutes of a video", returns: "Search the Ad Library by keyword or advertiser, or chain any Ad Library scraper's dataset. Video ads come back as a full transcript, the first-3-seconds hook, CTA and timestamped segments; image ads as headline, body and CTA read off the creative.", template: "facebook-ad-transcripts.workflow.json", template2: "competitor-ad-teardown.workflow.json" },
  "tiktok-ads-transcript-scraper": { name: "TikTok Top Ads transcripts", unit: "ad", free: 0.02, gold: 0.008, extra: "+ $0.005 per minute beyond the first 3 minutes", returns: "Pick a region and industry and it finds the current Creative Center Top Ads itself, then transcribes them: transcript, hook, brand, CTR, cost and likes on one row. Also accepts video URLs, material IDs or a scraper's dataset ID." },
  "linkedin-ads-transcript-scraper": { name: "LinkedIn Ad Library transcripts", unit: "ad", free: 0.02, gold: 0.008, extra: "+ $0.005 per minute beyond the first 3 minutes", returns: "Advertiser names, keywords, or just a market and date range. Video ads become transcripts with the hook; image ads (about four in five LinkedIn ads) have their on-image copy read out. Advertiser, headline, paying entity and language on every row." },
  "google-ads-video-transcript-scraper": { name: "Google Ads video transcripts", unit: "ad", free: 0.02, gold: 0.008, extra: "+ $0.005 per minute beyond the first 3 minutes", returns: "Advertiser names, domains or Transparency Center links in; one row per video ad with the transcript (caption track first, speech-to-text otherwise), hook, creative ID and language." },
  "google-ads-creative-text-scraper": { name: "Google Ads creative text (OCR)", unit: "creative", free: 0.015, gold: 0.004, returns: "The Transparency Center renders every ad as an image, so metadata scrapers never return the copy. This one reads it: headline, body, CTA, display URL and the raw text per creative." },
  "google-trends-scraper": { name: "Google Trends", unit: "report", free: 0.009, gold: 0.0075, returns: "Interest over time, multi-keyword compare on one shared scale, related queries (top and rising with growth), related topics with knowledge-graph IDs, interest by region and Trending Now. Schema-stable JSON, one row per keyword and surface.", template: null },
  "google-trends-now-scraper": { name: "Google Trends Now", unit: "trending search", free: 0.002, gold: 0.0005, returns: "Trending searches for any country with rank, Google's traffic floor, start time and the news behind each trend. No start fee, built for hourly schedules." },
  "breakout-keywords-scraper": { name: "Breakout keywords", unit: "keyword row", free: 0.006, gold: 0.0015, returns: "Rising and Breakout queries for seed keywords, with the growth percentage Google's UI hides behind the word Breakout." },
  "google-keyword-suggest-scraper": { name: "Autocomplete keywords, 5 engines", unit: "suggestion", free: 0.002, gold: 0.0005, returns: "Google, YouTube, Amazon, Bing and App Store autocomplete for one seed in one run. No API key, no login, no start fee." },
  "keyword-search-volume-scraper": { name: "Keyword volume and CPC", unit: "keyword result", free: 0.008, gold: 0.002, extra: "+ $0.19 per run that buys fresh data, from 16 September 2026 (runs answered from the 30-day cache pay none)", returns: "Google Ads Keyword Planner figures through a licensed provider: average monthly searches, competition, top-of-page bid range, 12-month series and trend direction, CPC where Google publishes one. No minimum batch, no charge on keywords with no data.", template: "keyword-search-volume.workflow.json" },
  "social-trends-scraper": { name: "Social trends, 5 platforms", unit: "trend", free: 0.004, gold: 0.001, returns: "What is trending on X, TikTok, Pinterest, YouTube Charts and Google, normalised to one row shape with rank, metric and link." },
  "indeed-jobs-scraper": { name: "Indeed jobs", unit: "listing", free: 0.006, gold: 0.0015, extra: "+ $0.0008 per full job description (optional)", returns: "Exact-country search that stops exactly at your row cap and deadline. Optional full descriptions as a second event." },
  "glassdoor-jobs-scraper": { name: "Glassdoor jobs with employer rating", unit: "listing", free: 0.0048, gold: 0.0012, returns: "Job listings with the employer's star rating on the same row (about four in five rows carry one), so there is no second run for the rating." },
  "google-jobs-scraper": { name: "Google Jobs", unit: "listing", free: 0.004, gold: 0.001, extra: "+ $0.004 per search that returns listings, from 16 September 2026", returns: "The full Google Jobs panel, about 90 to 130 cards per search where Google has them, with apply links. Stops at your cap." },
  "company-jobs-by-domain": { name: "Career-site jobs by domain", unit: "job", free: 0.0032, gold: 0.0008, extra: "+ $0.002 per company domain checked", returns: "Paste a company domain; it finds the Greenhouse, Lever, Ashby or Workday board (nine ATS platforms) and returns every live opening." },
  "multi-job-board-scraper": { name: "Multi-board jobs, de-duplicated", unit: "listing", free: 0.0072, gold: 0.0018, returns: "One keyword across Indeed and company hiring boards, merged into one feed. The same role on two boards is one row and one charge." },
  "amazon-product-scraper": { name: "Amazon product", unit: "product", free: 0.006, gold: 0.0015, returns: "ASIN or product URL in; price, buy box, stock, rating, review count, variants, bestseller ranks, images and the full specifications table in one row, one flat fee. Blocked or missing ASINs are not charged." },
  "amazon-search-scraper": { name: "Amazon search results", unit: "product", free: 0.006, gold: 0.0015, returns: "A search keyword in; the full product row for every result, with search rank, page and sponsored flag." },
  "amazon-bestsellers-scraper": { name: "Amazon bestsellers", unit: "bestseller", free: 0.006, gold: 0.0015, returns: "A category name or Best Sellers link in; the full product row for every rank, in rank order." },
  "amazon-seller-scraper": { name: "Amazon seller", unit: "record", free: 0.006, gold: 0.0015, returns: "Seller ID or storefront link in; the seller profile (feedback history, registered business details) plus a full product row for every listing." },
  "youtube-transcript-scraper": { name: "YouTube transcripts", unit: "video", free: 0.005, gold: 0.0012, extra: "+ $0.008 per minute of built-in speech-to-text when a video has no captions", returns: "Videos, Shorts and live VODs as JSON, plain text, SRT or VTT. Captions first; speech-to-text only when there are none, priced per minute." },
  "youtube-channel-transcripts": { name: "YouTube channel, all transcripts", unit: "video", free: 0.005, gold: 0.0012, extra: "+ $0.008 per speech-to-text minute", returns: "Paste a channel and get every video's transcript in one run, de-duplicated, with no per-channel fee." },
  "media-transcriber": { name: "Speech to text, any link or file", unit: "audio minute", free: 0.003, gold: 0.003, returns: "Any direct audio or video file link, or page links on 11 tested sites, to text, SRT and VTT with timestamped segments. Rounded up to the next whole minute; silent and unreachable items are not charged." },
  "instagram-reel-transcript-scraper": { name: "Instagram Reels transcripts", unit: "reel", free: 0.015, gold: 0.005, extra: "+ $0.005 per minute beyond the first 3 minutes", returns: "A creator's handle in, their recent reels back as text: transcript, first-3-seconds hook, language, segments, plus the reel's short code, caption, plays and likes. Also takes reel links or any Instagram scraper's dataset.", template: "instagram-reel-transcripts.workflow.json" },
  "instagram-profile-posts": { name: "Instagram profile posts", unit: "post", free: 0.0024, gold: 0.0006, extra: "+ $0.003 per profile that delivers posts, from 16 September 2026 (nothing on an empty profile)", returns: "Every post and reel from a public profile, newest by date (pinned posts flagged, not promoted), no login and no cookies. Your result limit is exact.", template: "instagram-profile-posts.workflow.json" },
};


const ROW = {
  "facebook-ads-transcript-scraper": "One ad creative: transcript, first-3s hook, CTA and segments for video; headline, body and CTA for image ads",
  "tiktok-ads-transcript-scraper": "One Top Ad: transcript, hook, brand, CTR, cost, likes",
  "linkedin-ads-transcript-scraper": "One ad: transcript and hook (video) or on-image copy (image), advertiser, paying entity",
  "google-ads-video-transcript-scraper": "One video ad: transcript, hook, creative ID, language",
  "google-ads-creative-text-scraper": "One creative: headline, body, CTA, display URL, raw text read from the rendered ad",
  "google-trends-scraper": "One keyword × one surface: interest over time, compare, related queries or topics, region, trending now",
  "google-trends-now-scraper": "One trending search: rank, traffic floor, start time, news behind it",
  "breakout-keywords-scraper": "One rising or Breakout query with its real growth percentage",
  "keyword-search-volume-scraper": "One keyword: monthly searches, competition, bid range, 12-month series, CPC where Google publishes it",
  "google-keyword-suggest-scraper": "One autocomplete suggestion from Google, YouTube, Amazon, Bing or the App Store",
  "social-trends-scraper": "One trending item on X, TikTok, Pinterest, YouTube Charts or Google: rank, metric, link",
  "indeed-jobs-scraper": "One listing card; the full description is an optional second event at $0.0008",
  "glassdoor-jobs-scraper": "One listing with the employer's star rating on the same row",
  "google-jobs-scraper": "One job card from the full panel, with apply links",
  "company-jobs-by-domain": "One live opening from a company's own ATS board; $0.002 per domain checked",
  "multi-job-board-scraper": "One de-duplicated listing across Indeed and company boards",
  "amazon-product-scraper": "One product: price, buy box, stock, rating, review count, variants, ranks, images, full specs table",
  "amazon-search-scraper": "One search result as a full product row, with rank, page and sponsored flag",
  "amazon-bestsellers-scraper": "One ranked bestseller as a full product row",
  "amazon-seller-scraper": "One seller profile, or one of its listings as a full product row",
  "youtube-transcript-scraper": "One video: captions as JSON, text, SRT or VTT; speech to text at $0.008 per minute when there are none",
  "youtube-channel-transcripts": "One video from a whole channel, same fields, no per-channel fee",
  "media-transcriber": "One audio minute transcribed: text, SRT, VTT, segments",
  "instagram-reel-transcript-scraper": "One reel: transcript, hook, language, segments, short code, caption, plays, likes",
  "instagram-profile-posts": "One post or reel: caption, like and comment counts, media, date, pinned flag",
};
const TRANSCRIPT_COL = { "google-ads-creative-text-scraper": "Image text (OCR)", "instagram-profile-posts": "—", "media-transcriber": "Speech to text", "youtube-transcript-scraper": "Captions + speech to text", "youtube-channel-transcripts": "Captions + speech to text", "instagram-reel-transcript-scraper": "Speech to text" };

// ---------- COMPETITORS (live Sep-1; free = FREE-plan tier, gold = GOLD tier, start = per-run fee) ----------
const C = {
  // ads
  "apify/facebook-ads-scraper": { free: 0.0058, gold: 0.0034, start: 0, users: 5515, returns: "Ad Library metadata rows (advertiser, text, dates, media URLs); optional e-commerce enrichment", transcripts: "No" },
  "curious_coder/facebook-ads-library-scraper": { free: 0.00075, gold: 0.00075, start: 0.00005, users: 5454, returns: "Ad Library metadata rows with media URLs", transcripts: "No" },
  "igolaizola/facebook-ad-library-scraper": { free: 0.00075, gold: 0.0003, start: 0.0075, users: 787, returns: "Ad Library rows; optional detail fetch at the same price again", transcripts: "No" },
  "brilliant_gum/facebook-ads-library-scraper": { free: 0.015, gold: 0.015, start: 0.001, users: 260, returns: "Meta and Instagram ads from the Ad Library", transcripts: "No" },
  "automation-lab/facebook-ads-transcript-scraper": { free: 0.00045329, gold: 0.0002365, start: 0.005, users: 5, returns: "Priced per item; 11 users since its August 25 launch", transcripts: "Yes (per its title)" },
  "lexis-solutions/tiktok-ads-scraper": { free: 0.00049, gold: 0.00049, start: 0.00001, users: 163, returns: "Creative Center ad metadata rows", transcripts: "No" },
  "khadinakbar/tiktok-ads-scraper": { free: 0.003, gold: 0.003, start: 0.00005, users: 53, returns: "Creative Center Top Ads metadata", transcripts: "No" },
  "brilliant_gum/tiktok-ads-library-scraper": { free: 0.015, gold: 0.015, start: 0.001, users: 74, returns: "EU Ad Library and Creative Center rows", transcripts: "No" },
  "s-r/linkedin-ads-library": { free: 0.005, gold: 0.005, start: 0, users: 41, returns: "LinkedIn Ad Library rows", transcripts: "No" },
  "data_xplorer/linkedin-ad-library-scraper": { free: 0.0015, gold: 0.0005, start: 0, users: 15, returns: "LinkedIn Ad Library rows", transcripts: "No" },
  "azzouzana/linkedin-ads-library-scraper": { free: 0.0005, gold: 0.0005, start: 0.005, users: 32, returns: "LinkedIn Ad Library rows; ad details at the same price again", transcripts: "No" },
  "solidcode/ads-transparency-scraper": { free: 0.0015, gold: 0.0008, start: 0.001, users: 509, returns: "Google Ads Transparency metadata rows (IDs, dates, formats, screenshot URLs)", transcripts: "No" },
  "scrapesage/google-ads-transparency-scraper": { free: 0.002, gold: 0.002, start: 0, users: 418, returns: "Transparency Center ads; details and advertiser lookups at $0.003 each", transcripts: "No" },
  "clockworks/tiktok-transcript-extractor": { free: 0.0037, gold: 0.0017, start: 0, users: 126, returns: "Organic TikTok videos, not ads; transcription billed per minute at $0.048 (free plan) / $0.027 (Business)", transcripts: "Yes, organic videos" },
  "sian.agency/best-tiktok-ai-transcript-extractor": { free: 0.025, gold: 0.01, start: 0.005, users: 163, returns: "Organic TikTok content processed with AI transcripts", transcripts: "Yes, organic videos" },
  "scrape-creators/best-tiktok-transcripts-scraper": { free: 0.001, gold: 0.001, start: 0, users: 228, returns: "Organic TikTok captions/transcripts", transcripts: "Yes, organic videos" },
  // trends + keywords
  "apify/google-trends-scraper": { free: 0.003, gold: 0.0003, start: 0, users: 1195, returns: "Interest over time and related data as rows; the official Apify actor", transcripts: null },
  "data_xplorer/google-trends-fast-scraper": { free: 0.002, gold: 0.0005, start: 0.02, users: 364, returns: "Trends rows with a $0.02 fee on every run", transcripts: null },
  "khadinakbar/google-trends-scraper": { free: 0.005, gold: 0.005, start: 0.00005, users: 72, returns: "Interest, regions and related queries", transcripts: null },
  "automation-lab/google-trends-scraper": { free: 0.138, gold: 0.072, start: 0.005, users: 58, returns: "Charged per keyword analysed ($0.138 free plan / $0.072 Business) plus $0.00115 per trend row", transcripts: null },
  "vnx0/google-trends-scraper": { free: 0.0012, gold: 0.0012, start: 0, users: 118, returns: "Daily trending keywords", transcripts: null },
  "data_xplorer/google-trends-trending-now": { free: 0.001, gold: 0.00025, start: 0.02, users: 43, returns: "Trending Now rows with a $0.02 fee on every run", transcripts: null },
  "iskander/google-keyword-search-volume-api": { free: 1.99, gold: 0.4, start: 0.00005, users: 131, returns: "Volume and CPC, billed per batch of up to 1,000 keywords ($1.99 free plan / $0.40 Business per batch, even for 10 keywords)", transcripts: null, batch: true },
  "aitorsm/keyword-volume": { free: 0.012, gold: 0.008, start: 0.00005, users: 367, returns: "Bulk Google metrics with CPC and trend; an 'AI volume' event at the same price", transcripts: null },
  "crawlerbros/google-keywords-suggest-scraper-pro": { free: 0.002, gold: 0.001, start: 0.005, users: 20, returns: "Google autocomplete suggestions", transcripts: null },
  "memo23/google-suggest-scraper": { free: 0.0005, gold: 0.0005, start: 0.005, users: 43, returns: "Google autocomplete suggestions", transcripts: null },
  "easyapi/google-trends-keywords-discovery-tool": { free: 0.00299, gold: 0.00299, start: 0.09, users: 31, returns: "Rising queries, trending topics and interest by region as rows", transcripts: null },
  "simpleapi/google-trends-scraper": { free: 0.00299, gold: 0.00299, start: 0.00005, users: 1, returns: "Search interest, rising topics, comparisons and regional stats as rows", transcripts: null },
  "apiagent/google-trends-mcp": { free: 0.0003, gold: 0.0003, start: 0.02, users: 1, returns: "Rising keyword rows with a five-year seasonality timeline and timing fields", transcripts: null },
  "automa-flow/google-trends-monitor": { free: 0.004, gold: 0.004, start: 0, users: 1, returns: "Charged per completed keyword group, not per row; a Trending Now feed is $0.002", transcripts: null, unitNote: "per keyword group" },
  "razorkaan/google-trends-keyword-opportunity-finder": { free: 0.15, gold: 0.15, start: 0, users: 1, returns: "Expands one seed niche into ranked keyword opportunities; charged per completed analysis, not per row", transcripts: null, unitNote: "per completed analysis" },
  "doesaiknow/keyword-seasonality-breakout-tracker": { free: 0.018, gold: 0.012, start: 0.005, users: 0, returns: "One row per keyword: five years of weekly interest, peak and trough weeks, a breakout alert", transcripts: null },
  // social trends
  "data_xplorer/tiktok-trends": { free: 0.0015, gold: 0.0005, start: 0.025, users: 231, returns: "TikTok Creative Center hashtags, videos and creators with rankings and engagement stats", transcripts: null },
  "automation-lab/tiktok-trends-scraper": { free: 0.015, gold: 0.0082, start: 0.05, users: 189, returns: "Creative Center hashtags plus the videos, sounds and creators on TikTok Explore", transcripts: null },
  "karamelo/twitter-trends-scraper": { free: 0.00039, gold: 0.00009, start: 0, users: 156, returns: "X trends by country across eight time windows, with tweet volumes", transcripts: null },
  "automation-lab/twitter-trends-scraper": { free: 0.00023, gold: 0.00012, start: 0.003, users: 80, returns: "X trends for a country, city or worldwide; up to 50 per location with tweet volumes", transcripts: null },
  "automation-lab/pinterest-trends-scraper": { free: 0.00115, gold: 0.0006, start: 0.005, users: 36, returns: "Pinterest trend keywords with growth scores, seasonality and country metadata", transcripts: null },
  "yumitori/pinterest-trends-scraper": { free: 0, gold: 0, start: 0, users: 34, returns: "Pinterest trending keywords with search volume and 52-week history; the actor charges nothing, so you pay only Apify platform usage", transcripts: null },
  "zentrafoundry/social-trend-radar-reddit-x-youtube": { free: 0.029, gold: 0.029, start: 0, users: 1, returns: "Reddit, X and YouTube inputs returned as rising topics, clusters and source leaderboards", transcripts: null },
  // jobs
  "valig/indeed-jobs-scraper": { free: 0.0001, gold: 0.00007, start: 0.001, users: 3670, returns: "Indeed listings; the category's most-used actor", transcripts: null },
  "borderline/indeed-scraper": { free: 0.005, gold: 0.005, start: 0, users: 2541, returns: "Indeed listings, pay per result", transcripts: null },
  "kaix/indeed-scraper": { free: 0.00005, gold: 0.00004, start: 0.00001, users: 1398, returns: "Indeed listings", transcripts: null },
  "cheap_scraper/indeed-job-scraper": { free: 0.001, gold: 0.0007, start: 0.00005, users: 328, returns: "Indeed listings with duplicate removal", transcripts: null },
  "valig/glassdoor-jobs-scraper": { free: 0.0004, gold: 0.00028, start: 0.001, users: 1409, returns: "Glassdoor listings", transcripts: null },
  "orgupdate/glassdoor-jobs-scraper": { free: 0.004, gold: 0.004, start: 0.002, users: 160, returns: "Glassdoor listings", transcripts: null },
  "memo23/glassdoor-scraper-ppr": { free: 0.00475, gold: 0.00475, start: 0.005, users: 192, returns: "Glassdoor reviews and jobs, with paid AI employer-intel add-ons", transcripts: null },
  "gio21/google-jobs-scraper": { free: 0.003, gold: 0.003, start: 0, users: 242, returns: "Google Jobs listings", transcripts: null },
  "johnvc/Google-Jobs-Scraper": { free: 0.15, gold: 0.1, start: 0.00005, users: 320, returns: "Charged per page processed ($0.15 free plan / $0.10 Business), not per job", transcripts: null, page: true },
  "orgupdate/google-jobs-scraper": { free: 0.2, gold: 0.15, start: 0.2, users: 213, returns: "Charged $0.20 per dataset item plus a $0.20 run fee as priced on the store", transcripts: null, page: true },
  "openclawai/job-board-scraper": { free: 0.005, gold: 0.005, start: 0.00005, users: 388, returns: "LinkedIn, Indeed, Glassdoor and more in one run", transcripts: null },
  "doggo/uk-jobs-board-scraper": { free: 0.005, gold: 0.004, start: 0.1, users: 41, returns: "Indeed, Reed, Adzuna, RemoteOK and more, with a $0.10 fee per run", transcripts: null },
  // amazon
  "junglee/Amazon-crawler": { free: 0.005, gold: 0.003, start: 0, users: 1860, returns: "Product rows; offers and sellers are separate events at $0.0025 / $0.0015 each, delivery-location pricing at $0.06 / $0.035", transcripts: null },
  "junglee/amazon-bestsellers": { free: 0.0059, gold: 0.0032, start: 0, users: 330, returns: "Bestseller rows", transcripts: null },
  "junglee/amazon-seller-scraper": { free: 0.005, gold: 0.003, start: 0, users: 64, returns: "Seller rows", transcripts: null },
  "automly/amazon-products-scraper---fast-efficient-with-sales-data": { free: 0.00555, gold: 0.00555, start: 0.05, users: 245, returns: "Product rows with sales data, $0.05 per run", transcripts: null },
  "igview-owner/amazon-search-scraper": { free: 0.02, gold: 0.005, start: 0.02, users: 67, returns: "Search result rows", transcripts: null },
  "amazon-scraper/amazon-bestsellers-scraper": { free: 0.002, gold: 0.00029, start: 0.00005, users: 139, returns: "Bestseller rows", transcripts: null },
  "khadinakbar/amazon-bestsellers-scraper": { free: 0.005, gold: 0.005, start: 0.00005, users: 48, returns: "Bestseller rows", transcripts: null },
  "khadinakbar/amazon-search-scraper": { free: 0.002, gold: 0.002, start: 0.00005, users: 39, returns: "Search result rows", transcripts: null },
  "pratikdani/amazon-seller-extractor": { free: 0.02, gold: 0.01, start: 0.002, users: 11, returns: "Seller data rows", transcripts: null },
  // youtube + media
  "pintostudio/youtube-transcript-scraper": { free: 0.01, gold: 0.007, start: 0, users: 2547, returns: "Caption transcripts; the category's most-used actor", transcripts: "Captions" },
  "starvibe/youtube-video-transcript": { free: 0.005, gold: 0.005, start: 0, users: 2074, returns: "Caption transcripts", transcripts: "Captions" },
  "karamelo/youtube-transcripts": { free: 0.007, gold: 0.005, start: 0, users: 844, returns: "Caption transcripts", transcripts: "Captions" },
  "supreme_coder/youtube-transcript-scraper": { free: 0.001, gold: 0.0007, start: 0.00005, users: 621, returns: "Caption transcripts", transcripts: "Captions" },
  "codepoetry/youtube-transcript-ai-scraper": { free: 0.001, gold: 0.0007, start: 0.0025, users: 407, returns: "Captions, with an AI fallback at $0.012 / $0.009 per minute", transcripts: "Captions + AI fallback" },
  "scrape-creators/best-youtube-transcripts-scraper": { free: 0.001, gold: 0.001, start: 0, users: 241, returns: "Caption transcripts", transcripts: "Captions" },
  "kaz_kakyo/audio-transcriber": { free: 0.01, gold: 0.01, start: 0.00005, users: 86, returns: "Speech to text with SRT and diarization, per audio minute; $0.004 per minute with your own key", transcripts: "Speech to text", minute: true },
  "sauliusautomatesit/media-transcriber": { free: 0.04, gold: 0.034, start: 0.00005, users: 28, returns: "Whisper speech to text, per audio minute", transcripts: "Speech to text", minute: true },
  "makework36/instagram-reels-transcript-scraper": { free: 0.015, gold: 0.015, start: 0.005, users: 77, returns: "$0.003 to scrape each reel plus $0.012 to transcribe it", transcripts: "Speech to text" },
  "linen_snack/instagram-reel-transcript-ai-extractor": { free: 0.02, gold: 0.02, start: 0, users: 65, returns: "AI transcript per reel", transcripts: "Speech to text" },
  "afanasenko/instagram-reel-script-extractor": { free: 0.075, gold: 0.066, start: 0, users: 166, returns: "Transcript, on-screen text and hooks per reel", transcripts: "Speech to text + on-screen text" },
  "scraping_solutions/instagram-reels-transcript-scraper-audio-to-text": { free: 0.0028, gold: 0.0025, start: 0, users: 98, returns: "Per reel plus $0.0065 / $0.0049 per audio minute", transcripts: "Speech to text" },
  "instagram-scraper/fast-instagram-post-scraper": { free: 0.001, gold: 0.0003, start: 0.0005, users: 926, returns: "Profile posts; filtered rows and restricted profiles are charged separately", transcripts: null },
  "instagram-scraper/instagram-profile-posts-scraper": { free: 0.001, gold: 0.00045, start: 0.0005, users: 611, returns: "Profile posts; filtered-out rows and restricted profiles charged separately", transcripts: null },
  "data-slayer/instagram-posts": { free: 0.0025, gold: 0.0015, start: 0.002, users: 225, returns: "Profile posts and reels, no login", transcripts: null },
};

const VENDORS = {
  foreplay: { name: "Foreplay (subscription)", url: "https://www.foreplay.co/pricing", price: "$59 / $175 / $459 per month (Basic / Workflow / Agency; $49 / $149 / $389 on annual billing). Transcripts included; API access 10,000 credits per month.", returns: "A saved-ads workspace with automated transcription and boards; priced per seat, not per ad", transcripts: "Yes" },
  scrapecreators: { name: "ScrapeCreators API", url: "https://scrapecreators.com/", price: "$47 for 25,000 credits ($1.88 per 1,000 requests); $497 for 500,000 ($0.99 per 1,000). Credits never expire.", returns: "37+ REST endpoints; TikTok video transcript endpoint listed; Facebook Ad Library endpoints listed without a transcript endpoint on the pricing page", transcripts: "TikTok organic; not listed for Ad Library" },
  serpapi: { name: "SerpApi (Google Trends API)", url: "https://serpapi.com/pricing", price: "$25 per month for 1,000 searches ($25 per 1,000) down to $2,750 for 500,000 ($5.50 per 1,000).", returns: "Interest over time, interest by region, related topics and related queries, one search per call" },
  glimpse: { name: "Glimpse", url: "https://meetglimpse.com/", price: "No public price list; sign-up and demo.", returns: "Trends dashboard and Chrome extension" },
  supadata: { name: "Supadata API", url: "https://supadata.ai/pricing", price: "$5 for 300 credits ($16.67 per 1,000) down to $897 for 1,000,000 ($0.90 per 1,000). A caption transcript is 1 credit; a generated (speech-to-text) transcript is 2 credits per minute.", returns: "Transcript API for YouTube, TikTok, Instagram and X", transcripts: "Yes" },
  rainforest: { name: "Rainforest API (Traject Data)", url: "https://trajectdata.com/pricing/rainforest-api", price: "$23 per month for 500 requests ($46 per 1,000) down to $9,000 for 20,000,000 ($0.45 per 1,000), annual billing.", returns: "Amazon product, search, bestsellers, sellers, reviews and more, one request per page" },
};

// ---------- FAMILY PAGES ----------
const FAMILIES = [
  {
    dir: "ad-transcripts",
    title: "Bulk ad transcripts: Facebook, TikTok, LinkedIn and Google Ads scrapers compared",
    desc: "Which tools turn competitor ads into transcripts and hooks in bulk, what each one returns, and what a thousand ads cost on Apify, Foreplay and ScrapeCreators. Prices checked " + CHECKED + ".",
    h1: "Bulk ad transcripts, compared honestly",
    intro: [
      "Ad libraries hand you metadata: advertiser, dates, a media URL. The creative itself, what the ad actually says in its first three seconds, is the part a media buyer, a creative strategist or an ad-intelligence pipeline needs, and almost no scraper delivers it.",
      "This page compares every Apify actor that comes up for those searches, plus the two subscription tools people ask about, on what they return and what a thousand ads cost. Our five actors are on it, priced the same way, so you can judge them against the field.",
    ],
    ours: ["facebook-ads-transcript-scraper", "tiktok-ads-transcript-scraper", "linkedin-ads-transcript-scraper", "google-ads-video-transcript-scraper", "google-ads-creative-text-scraper"],
    groups: [
      { label: "Facebook / Meta Ad Library", ids: ["apify/facebook-ads-scraper", "curious_coder/facebook-ads-library-scraper", "igolaizola/facebook-ad-library-scraper", "brilliant_gum/facebook-ads-library-scraper", "automation-lab/facebook-ads-transcript-scraper"], ourSlug: "facebook-ads-transcript-scraper" },
      { label: "TikTok ads and TikTok transcripts", ids: ["lexis-solutions/tiktok-ads-scraper", "khadinakbar/tiktok-ads-scraper", "brilliant_gum/tiktok-ads-library-scraper", "clockworks/tiktok-transcript-extractor", "sian.agency/best-tiktok-ai-transcript-extractor", "scrape-creators/best-tiktok-transcripts-scraper"], ourSlug: "tiktok-ads-transcript-scraper" },
      { label: "LinkedIn Ad Library", ids: ["s-r/linkedin-ads-library", "data_xplorer/linkedin-ad-library-scraper", "azzouzana/linkedin-ads-library-scraper"], ourSlug: "linkedin-ads-transcript-scraper" },
      { label: "Google Ads Transparency Center", ids: ["solidcode/ads-transparency-scraper", "scrapesage/google-ads-transparency-scraper"], ourSlug: "google-ads-video-transcript-scraper", ourSlug2: "google-ads-creative-text-scraper" },
    ],
    vendors: ["foreplay", "scrapecreators"],
    reading: [
      "Metadata scrapers are cheaper per row because they deliver less per row. A thousand Ad Library rows from the most-used scraper cost $0.75; a thousand transcribed video ads from us cost $10 to $20 depending on your Apify plan. If you only need who is running ads, use the metadata scraper. If you need what the ads say, chain it into ours by dataset ID and pay only for the ads that transcribe.",
      "Foreplay is a workspace, not a pipeline: transcripts are included in a per-seat subscription starting at $59 a month, with API access capped by credits. That is the right shape for a small team browsing ads by hand and the wrong shape for a scheduled feed of thousands of creatives.",
      "The TikTok transcript actors above work on organic videos, not ads. Ours discovers Creative Center Top Ads for a region and industry on its own, so the first run works with nothing to prepare.",
    ],
    not: [
      "We do not estimate spend, reach or audience; the ad libraries do not publish those and we do not model them.",
      "We do not store a browsable library or boards. Output is a dataset you keep, export or pipe onward.",
      "A silent or music-only video is not charged unless you switch on on-screen text reading, in which case a video with readable on-screen text is delivered as a charged row.",
      "We do not cover Snapchat, Pinterest or Reddit ad libraries.",
    ],
  },
  {
    dir: "trends-keywords",
    title: "Google Trends API alternatives and keyword volume scrapers compared",
    desc: "Google Trends scrapers, SerpApi, Glimpse and keyword search volume actors compared on what they return and what a thousand reports cost. Prices checked " + CHECKED + ".",
    h1: "Google Trends and keyword data, compared honestly",
    intro: [
      "Google Trends has no official API, Keyword Planner numbers sit behind an Ads account, and autocomplete is scattered across five engines. The tools below fill those gaps in different shapes: per-report actors, per-search SERP APIs and dashboards.",
      "Our six actors in this family are listed with the same columns as everyone else. Where a competitor is cheaper per row, the table says so.",
    ],
    ours: ["google-trends-scraper", "google-trends-now-scraper", "breakout-keywords-scraper", "keyword-search-volume-scraper", "google-keyword-suggest-scraper", "social-trends-scraper"],
    groups: [
      { label: "Google Trends", ids: ["apify/google-trends-scraper", "data_xplorer/google-trends-fast-scraper", "khadinakbar/google-trends-scraper", "automation-lab/google-trends-scraper"], ourSlug: "google-trends-scraper" },
      { label: "Trending now", ids: ["vnx0/google-trends-scraper", "data_xplorer/google-trends-trending-now"], ourSlug: "google-trends-now-scraper" },
      { label: "Rising and breakout keywords", ids: ["easyapi/google-trends-keywords-discovery-tool", "simpleapi/google-trends-scraper", "apiagent/google-trends-mcp", "automa-flow/google-trends-monitor", "razorkaan/google-trends-keyword-opportunity-finder", "doesaiknow/keyword-seasonality-breakout-tracker"], ourSlug: "breakout-keywords-scraper" },
      { label: "Social trends feeds", ids: ["data_xplorer/tiktok-trends", "automation-lab/tiktok-trends-scraper", "karamelo/twitter-trends-scraper", "automation-lab/twitter-trends-scraper", "automation-lab/pinterest-trends-scraper", "yumitori/pinterest-trends-scraper", "zentrafoundry/social-trend-radar-reddit-x-youtube"], ourSlug: "social-trends-scraper" },
      { label: "Keyword search volume and CPC", ids: ["iskander/google-keyword-search-volume-api", "aitorsm/keyword-volume"], ourSlug: "keyword-search-volume-scraper" },
      { label: "Autocomplete suggestions", ids: ["crawlerbros/google-keywords-suggest-scraper-pro", "memo23/google-suggest-scraper"], ourSlug: "google-keyword-suggest-scraper" },
    ],
    vendors: ["serpapi", "glimpse"],
    reading: [
      "The official Apify Google Trends actor is the cheapest per row on the Business plan ($0.30 per 1,000) and has the most users by far. Ours costs more per report and returns each keyword as one schema-stable row per surface, with related topics carrying their knowledge-graph IDs and a compare mode that scores up to five keywords on one shared scale. Pick by what your pipeline needs downstream.",
      "Per-run fees matter on schedules. An actor with a $0.02 start fee costs $14.40 a month before the first row if it runs hourly. Our Trends Now and autocomplete actors have no start fee for that reason.",
      "On keyword volume, iskander's actor bills per batch of 1,000 keywords and is much cheaper per keyword when your batches are full. Ours charges per keyword with no minimum batch and never charges a keyword Google returns no data for; from 16 September 2026 a run that buys fresh data also pays one $0.19 fresh-lookup fee, waived when the run is answered from the 30-day cache. That is still the better deal for lists of ten and the worse deal for lists of ten thousand.",
      "SerpApi's Google Trends API returns the same four surfaces one search at a time, from $25 per 1,000 searches on its smallest plan.",
      "Rising and Breakout queries are one surface of Google Trends, so most of the actors on that plate are general Trends scrapers that also return them. Two are priced per completed analysis or per keyword group rather than per row, which is cheap on a long seed list and dear on a short one. Ours charges per rising or Breakout query returned and puts the growth percentage on the row.",
      "Social trends is a field of one actor per platform. X, TikTok and Pinterest each have their own, and one Pinterest actor charges nothing at all, so you pay only Apify platform usage for it. Ours returns X, TikTok, Pinterest, YouTube Charts and Google in one run on one row shape, and costs more per row than the cheapest single-platform actors.",
    ],
    not: [
      "We do not invent a keyword-difficulty score or an 'AI search volume'. Every figure is Google's own, and the field says so.",
      "Trends interest is Google's 0 to 100 index, not an absolute search count. Only the keyword-volume actor returns absolute monthly searches.",
      "Related topics are metered by Google and can come back empty on a busy moment; that row is not charged.",
    ],
  },
  {
    dir: "jobs",
    title: "Indeed, Glassdoor and Google Jobs scrapers compared",
    desc: "Job board scrapers on Apify compared on price per thousand listings, start fees and what each returns, with career-site and multi-board options. Prices checked " + CHECKED + ".",
    h1: "Job listing scrapers, compared honestly",
    intro: [
      "Job data on Apify is a mature, crowded category with very cheap incumbents. This page lists them next to our five actors with the same columns, because a buyer comparing on price alone should see the numbers before they run anything.",
      "Our actors cost more per listing than the biggest incumbents. What they add is written in the cards below; whether that is worth the difference is your call.",
    ],
    ours: ["indeed-jobs-scraper", "glassdoor-jobs-scraper", "google-jobs-scraper", "company-jobs-by-domain", "multi-job-board-scraper"],
    groups: [
      { label: "Indeed", ids: ["valig/indeed-jobs-scraper", "borderline/indeed-scraper", "kaix/indeed-scraper", "cheap_scraper/indeed-job-scraper"], ourSlug: "indeed-jobs-scraper" },
      { label: "Glassdoor", ids: ["valig/glassdoor-jobs-scraper", "orgupdate/glassdoor-jobs-scraper", "memo23/glassdoor-scraper-ppr"], ourSlug: "glassdoor-jobs-scraper" },
      { label: "Google Jobs", ids: ["gio21/google-jobs-scraper", "johnvc/Google-Jobs-Scraper", "orgupdate/google-jobs-scraper"], ourSlug: "google-jobs-scraper" },
      { label: "Multi-board and career sites", ids: ["openclawai/job-board-scraper", "doggo/uk-jobs-board-scraper"], ourSlug: "multi-job-board-scraper", ourSlug2: "company-jobs-by-domain" },
    ],
    vendors: [],
    reading: [
      "valig's Indeed and Glassdoor actors are the volume leaders and cost a fraction of a cent per listing. If you need raw listings at scale and can de-duplicate and cap on your side, they are hard to beat on price.",
      "Ours charge more per listing and put the controls inside the run: the row cap and deadline stop the run exactly where you set them, the same role found on two boards is one row and one charge, and Glassdoor's employer rating lands on the job row instead of needing a second run.",
      "Some Google Jobs actors are priced per page or per run rather than per job; compare on your real query mix, not the headline.",
    ],
    not: [
      "We do not scrape LinkedIn Jobs.",
      "We do not enrich listings with recruiter emails or phone numbers.",
      "Indeed full descriptions are a separate, optional event on our Indeed actor ($0.0008 each); the listing price alone returns the card fields.",
    ],
  },
  {
    dir: "amazon",
    title: "Amazon product, search, bestseller and seller scrapers compared",
    desc: "Amazon scrapers on Apify and the Rainforest API compared on what one product row contains and what a thousand products cost, including add-on events. Prices checked " + CHECKED + ".",
    h1: "Amazon product data, compared honestly",
    intro: [
      "Most Amazon scrapers price the product row low and charge separately for offers, sellers or delivery-location pricing. Ours charge one flat fee per product and put everything the product page carries in that one row. Which is cheaper depends on what you actually need.",
    ],
    ours: ["amazon-product-scraper", "amazon-search-scraper", "amazon-bestsellers-scraper", "amazon-seller-scraper"],
    groups: [
      { label: "Product pages", ids: ["junglee/Amazon-crawler", "automly/amazon-products-scraper---fast-efficient-with-sales-data"], ourSlug: "amazon-product-scraper" },
      { label: "Search results", ids: ["igview-owner/amazon-search-scraper", "khadinakbar/amazon-search-scraper"], ourSlug: "amazon-search-scraper" },
      { label: "Bestsellers", ids: ["junglee/amazon-bestsellers", "amazon-scraper/amazon-bestsellers-scraper", "khadinakbar/amazon-bestsellers-scraper"], ourSlug: "amazon-bestsellers-scraper" },
      { label: "Sellers", ids: ["junglee/amazon-seller-scraper", "pratikdani/amazon-seller-extractor"], ourSlug: "amazon-seller-scraper" },
    ],
    vendors: ["rainforest"],
    reading: [
      "junglee's Amazon Product Scraper is the category's incumbent with 22,000 users. Its base row is $5 per 1,000 on the free plan; offers, sellers and delivery-location pricing are extra events. Our product row is $6 per 1,000 on the free plan and $1.50 on Business, with buy box, stock, variants, ranks, images and the specifications table included.",
      "Rainforest API is the dedicated off-Apify option: one request per page, from $46 per 1,000 on the smallest plan down to $0.45 per 1,000 at twenty million requests a month.",
    ],
    not: [
      "We do not scrape reviews text.",
      "We do not return delivery-location or Prime-specific pricing variants.",
      "We do not provide seller contact details beyond what the public storefront shows.",
    ],
  },
  {
    dir: "youtube-media",
    title: "YouTube transcript, Instagram Reels transcript and speech-to-text scrapers compared",
    desc: "YouTube caption scrapers, Instagram Reels transcript actors, Whisper-style media transcribers and the Supadata API compared on price per thousand videos or minutes. Prices checked " + CHECKED + ".",
    h1: "Video and audio to text, compared honestly",
    intro: [
      "Two very different jobs hide under the word transcript. Pulling YouTube's existing captions costs a tenth of a cent per video. Turning speech into text costs per minute of audio. The tables below keep them apart.",
    ],
    ours: ["youtube-transcript-scraper", "youtube-channel-transcripts", "media-transcriber", "instagram-reel-transcript-scraper", "instagram-profile-posts"],
    groups: [
      { label: "YouTube captions", ids: ["pintostudio/youtube-transcript-scraper", "starvibe/youtube-video-transcript", "karamelo/youtube-transcripts", "supreme_coder/youtube-transcript-scraper", "codepoetry/youtube-transcript-ai-scraper", "scrape-creators/best-youtube-transcripts-scraper"], ourSlug: "youtube-transcript-scraper", ourSlug2: "youtube-channel-transcripts" },
      { label: "Speech to text, per audio minute", ids: ["kaz_kakyo/audio-transcriber", "sauliusautomatesit/media-transcriber"], ourSlug: "media-transcriber", minute: true },
      { label: "Instagram Reels transcripts", ids: ["makework36/instagram-reels-transcript-scraper", "linen_snack/instagram-reel-transcript-ai-extractor", "afanasenko/instagram-reel-script-extractor", "scraping_solutions/instagram-reels-transcript-scraper-audio-to-text"], ourSlug: "instagram-reel-transcript-scraper" },
      { label: "Instagram profile posts", ids: ["instagram-scraper/fast-instagram-post-scraper", "instagram-scraper/instagram-profile-posts-scraper", "data-slayer/instagram-posts"], ourSlug: "instagram-profile-posts" },
    ],
    vendors: ["supadata"],
    reading: [
      "On YouTube captions we are mid-pack on price: $5 per 1,000 videos on the free plan, $1.20 on Business, against $1 for the cheapest caption scrapers and $10 for the most-used one. The difference is the fallback: a video with no captions still comes back with real text, billed per minute at $0.008, and a video we cannot transcribe is not charged.",
      "On speech to text per minute, our media transcriber is $3 per 1,000 minutes on every plan; the next actor charges $10 and the Whisper transcriber $34 to $40. Supadata's API charges 2 credits per generated minute, from $33 per 1,000 minutes on its smallest plan to $1.80 on its largest.",
      "For Instagram Reels, the actors that also read on-screen text charge up to $75 per 1,000. Ours is $15 on the free plan and $5 on Business for the spoken transcript with the hook; on-screen text is an opt-in.",
    ],
    not: [
      "We do not do speaker diarization or chapter generation.",
      "Instagram posts are read from public profiles only; private accounts return an uncharged row saying so.",
      "The Reels transcript is what is said in the audio, not the caption under the post.",
    ],
  },
];

// ---------- RENDER ----------
// Direction contract lives in the emitted markup (see `contract` below).
// Both faces are self-hosted, subsetted variable woff2 under /brand/fonts (SIL OFL).
// Same origin + preload means Archivo is there at first paint on a cold load, and the
// metric-matched fallbacks below cover the swap window without moving anything.
const N_OURS = Object.keys(OURS).length;
const N_COMP = Object.keys(C).length;
const N_VEND = Object.keys(VENDORS).length;
const FIG = " "; // figure space: one digit wide, so decimal points line up

// The mark, stretched into a rule: one clean step up and back down.
// The lead rule is revealed by a clip-path wipe, not a stroke dash: under
// non-scaling-stroke a dash is measured in screen pixels and stops short.
const pulse = (mod = "") => `<svg class="pulse${mod}" viewBox="0 0 1200 14" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 11H196V4H286V11H1200"/></svg>`;
const chip = `<span class="plate-chip"><svg viewBox="0 0 512 512" width="100%" height="100%" aria-hidden="true" focusable="false"><path d="M64 306H200V177H311V306H447" fill="none" stroke="#26DC62" stroke-width="40"/></svg></span>`;
const navLabel = (f) => f.h1.replace(", compared honestly", "");
const binomial = (id) => {
  const cut = id.indexOf("/");
  return `<span class="acct">${esc(id.slice(0, cut))}</span><span class="slash">/</span><wbr><span class="slug">${esc(id.slice(cut + 1))}</span>`;
};
const contract = `<!--
THESIS: a comparative plate, not a vendor comparison page: every actor in a family laid out as a
specimen at one shared scale, its price bar drawn even where ours is the longest. Refuses the
tick-and-cross "us vs them" table the category ships.
OWN-WORLD: the plate ground runs edge to edge (herbarium stock in light, the brand's own #050911
in dark); one ink, one accent (steadyfetch green), hairline rules, ledger rows rather than cards —
the only framed objects on a page are the plates. Archivo condensed for titles, Azeret Mono for
every measured figure and every actor binomial, set at focal scale.
STORY: the visitor sees the field measured on one scale, finds the row that beats us, reads why,
and goes to a store page to run an actor.
FIRST VIEWPORT: plate title, the collection stamp (what was read, from where, when), the lead,
then the proof — two Indeed specimens at identical scale where the competitor wins 60 to 1.
FORM: candidate 4 of the grounded list (comparative field-guide plate); seed key 0838385b.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
-->`;

function head(title, desc, path, extraJsonLd) {
  const url = SITE + path;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="article">
<meta property="og:image" content="${SITE}/brand/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:site_name" content="Steadyfetch">
<meta name="twitter:card" content="summary_large_image">
<meta name="robots" content="index,follow">
<meta name="theme-color" content="#e7eae3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#050911" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/brand/favicon.ico" sizes="32x32">
<link rel="icon" href="/brand/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/brand/apple-touch-icon.png">
<script>try{var t=localStorage.getItem("sf-theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>
<link rel="preload" href="/brand/fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/brand/fonts/azeret-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/style.css">
${extraJsonLd ? `<script type="application/ld+json">${JSON.stringify(extraJsonLd)}</script>` : ""}
</head>
<body>
${contract}
<a class="skip" href="#main">Skip to content</a>
<header class="top">
<div class="top-in">
<a class="lockup" href="/">${chip}<span class="name">steadyfetch</span></a>
<nav aria-label="Comparison pages">${FAMILIES.map(f => `<a href="/${f.dir}/"${path === `/${f.dir}/` ? ' aria-current="page"' : ""}>${esc(navLabel(f))}</a>`).join("")}</nav>
<button class="theme" type="button" id="theme" aria-label="Switch colour theme"><svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect x="1.5" y="1.5" width="13" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 1.5H4A2.5 2.5 0 0 0 1.5 4v8A2.5 2.5 0 0 0 4 14.5h4z" fill="currentColor"/></svg></button>
</div>
${pulse(" pulse--lead")}
</header>
<main id="main">`;
}

const stampBand = (parts) => `<p class="stamp">${parts.map(p => `<span>${esc(p)}</span>`).join("")}</p>`;

const foot = (updated) => `</main>
<footer>
${pulse(" pulse--faint")}
<div class="foot-in">
<p class="foot-mark">${chip}<span class="name">steadyfetch</span></p>
<p>Prices on this page were read on ${CHECKED} from the public Apify store API (free-plan and Business-plan tiers) and from each vendor's own pricing page, and are quoted per 1,000 units unless stated. Apify actor prices change with notice; the store page is the source of truth at run time. Users are the store's 30-day user count on the same day.</p>
<p>Steadyfetch actors are unofficial tools that read public pages. They are not affiliated with, endorsed by or sponsored by Meta, TikTok, LinkedIn, Google, Amazon, Indeed, Glassdoor or Instagram. Competitor and vendor names are their owners' trademarks and appear here only to identify the products compared.</p>
<p>Something on this page wrong? Open an issue on the actor's page on Apify; every one is read. Last updated ${updated}.</p>
</div>
</footer>
<script>(function(){var b=document.getElementById("theme");if(!b)return;var r=document.documentElement;function lab(){var d=(r.getAttribute("data-theme")||(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"))==="dark";b.setAttribute("aria-label",d?"Switch to the light plate":"Switch to the dark plate")}lab();b.addEventListener("click",function(){var cur=r.getAttribute("data-theme")||(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var next=cur==="dark"?"light":"dark";r.setAttribute("data-theme",next);try{localStorage.setItem("sf-theme",next)}catch(e){}lab()})})();</script>
</body>
</html>
`;

// One of our actors as a ledger row: prose left, the measurement in the shared right column.
function ourCard(slug) {
  const o = OURS[slug];
  const templates = [o.template, o.template2].filter(Boolean);
  return `<article class="act" id="${slug}">
<h3><a href="${store(slug)}">${esc(o.name)}</a></h3>
<div class="meter">
<div><b>${perK(o.free)}</b><span class="label">Free plan / 1,000</span></div>
<div><b>${perK(o.gold)}</b><span class="label">Business / 1,000</span></div>
<p class="unitline">per 1,000 ${esc(o.unit)}s${o.extra ? `<span class="ext">${esc(o.extra)}</span>` : ""}</p>
</div>
<div class="act-main">
<p class="returns">${esc(o.returns)}</p>
<p class="law">Charged only when a row lands in your dataset. Misses carry a status and <code>charged: false</code>.</p>
<p class="links"><a href="${store(slug)}">Store page</a> <a href="${mcp(slug)}">Pin to Apify MCP</a>${templates.map(t => ` <a href="${tpl(t)}">n8n · ${esc(t.replace(".workflow.json", "").replace(/-/g, " "))}</a>`).join("")} <a href="https://apify.com/steadyfetch/${slug}/api">API docs</a></p>
</div>
</article>`;
}

// One plate: the group's specimens, every figure on one locked column grid.
function compTable(g, family, idx) {
  const minute = !!g.minute;
  const wide = family.dir === "ad-transcripts" || family.dir === "youtube-media";
  const our = (slug) => {
    const o = OURS[slug];
    const u = { "google-trends-scraper": 16, "facebook-ads-transcript-scraper": 13, "media-transcriber": 4, "keyword-search-volume-scraper": 3, "glassdoor-jobs-scraper": 2, "instagram-reel-transcript-scraper": 2, "social-trends-scraper": 2, "youtube-transcript-scraper": 2, "instagram-profile-posts": 0 }[slug] ?? 1;
    return { id: `steadyfetch/${slug}`, href: store(slug), rel: "", diag: ROW[slug], t: TRANSCRIPT_COL[slug] ?? "Yes", free: o.free, gold: o.gold, freeTxt: perK(o.free), goldTxt: perK(o.gold), note: "", start: 0, users: u, mine: true };
  };
  const items = [our(g.ourSlug)];
  if (g.ourSlug2) items.push(our(g.ourSlug2));
  for (const id of g.ids) {
    const c = C[id];
    const odd = !!(c.batch || c.page || c.unitNote);
    const note = c.batch ? "per batch of 1,000" : c.page ? "per page/item" : c.unitNote || "";
    items.push({ id, href: `https://apify.com/${id}`, rel: ' rel="nofollow"', diag: c.returns, t: c.transcripts ?? "—", free: odd ? null : c.free, gold: odd ? null : c.gold, freeTxt: odd ? usd(c.free) : perK(c.free), goldTxt: odd ? usd(c.gold) : perK(c.gold), note, start: c.start, users: c.users, mine: false });
  }
  const peak = (k) => items.reduce((m, i) => (i[k] != null && i[k] > m ? i[k] : m), 0);
  const mf = peak("free"), mg = peak("gold");
  const gauge = (v, max) => (v == null || max <= 0 ? "" : `<span class="gauge"><span style="--w:${((v / max) * 100).toFixed(1)}%"></span></span>`);
  // fees keep every published digit; figure spaces pad the shorter ones so decimal points align
  const feeTxt = items.map(i => (i.start ? usd(i.start) : null));
  const maxFrac = feeTxt.reduce((m, t) => (t && t.includes(".") ? Math.max(m, t.split(".")[1].length) : m), 0);
  const padFee = (t) => (t == null ? '<span class="none">none</span>' : t + FIG.repeat(maxFrac - (t.includes(".") ? t.split(".")[1].length : 0)));
  const per = `per 1,000${minute ? " min" : ""}`;
  const id = `${family.dir}-plate-${idx}`;
  const rows = items.map((i, n) => `<tr${i.mine ? ' class="us"' : ""}>
<th scope="row"><a class="bi" href="${i.href}"${i.rel}>${binomial(i.id)}</a><span class="diag">${esc(i.diag)}</span></th>${wide ? `<td class="tx">${esc(i.t)}</td>` : ""}
<td class="num"><span class="v">${i.freeTxt}</span>${i.note ? `<span class="note">${esc(i.note)}</span>` : ""}${gauge(i.free, mf)}</td>
<td class="num"><span class="v">${i.goldTxt}</span>${i.note ? `<span class="note">${esc(i.note)}</span>` : ""}${gauge(i.gold, mg)}</td>
<td class="num fee">${padFee(feeTxt[n])}</td>
<td class="num">${i.users.toLocaleString("en-US")}</td>
</tr>`).join("\n");
  const unpriced = items.some(i => i.free == null);
  return `<section class="plate">
<div class="plate-head"><h3 id="${id}">${esc(g.label)}</h3><span class="label">${items.length} actors</span></div>
<div class="plate-scroll${wide ? " has-tx" : ""}" role="region" tabindex="0" aria-labelledby="${id}">
<table>
<colgroup><col class="c-id">${wide ? '<col class="c-tx">' : ""}<col class="c-n"><col class="c-n"><col class="c-fee"><col class="c-u"></colgroup>
<thead><tr><th scope="col">Actor · what a row is</th>${wide ? "<th scope=\"col\">Transcripts</th>" : ""}<th scope="col" class="num">Free plan, ${per}</th><th scope="col" class="num">Business plan, ${per}</th><th scope="col" class="num">Fee per run</th><th scope="col" class="num">Users, 30 days</th></tr></thead>
<tbody>${rows}</tbody>
</table>
</div>
<p class="scale-note"><span class="swatch"></span>Bars are drawn per column against the dearest row on this plate${unpriced ? "; rows sold by a different unit carry no bar, because the unit is not the same" : ""}.</p>
</section>`;
}

function vendorRows(keys) {
  if (!keys.length) return "";
  return `<h3 class="outside">Outside Apify</h3>
<div class="ledger">${keys.map(k => {
    const v = VENDORS[k];
    return `<article class="act vendor">
<h3><a href="${v.url}" rel="nofollow">${esc(v.name)}</a></h3>
<div class="meter"><p class="unitline"><span class="label">Price as published</span>${esc(v.price)}</p></div>
<div class="act-main"><p class="returns">${esc(v.returns)}</p></div>
</article>`;
  }).join("\n")}</div>`;
}

function familyPage(f) {
  const path = `/${f.dir}/`;
  const jsonld = { "@context": "https://schema.org", "@type": "WebPage", name: f.title, description: f.desc, url: SITE + path, dateModified: ISO, isPartOf: { "@type": "WebSite", name: "Steadyfetch", url: SITE }, about: f.ours.map(s => ({ "@type": "SoftwareApplication", name: OURS[s].name, url: store(s), applicationCategory: "DeveloperApplication", offers: { "@type": "Offer", price: OURS[s].free, priceCurrency: "USD", description: `per ${OURS[s].unit}, free plan` } })) };
  const compared = f.ours.length + f.groups.reduce((n, g) => n + g.ids.length, 0);
  return head(f.title, f.desc, path, jsonld) + `
<p class="crumbs"><a href="/">Steadyfetch</a><span class="sep">/</span>${esc(navLabel(f))}</p>
<h1>${esc(f.h1)}</h1>
${stampBand([`Prices checked ${CHECKED}`, "Per 1,000 units", "Free plan and Business plan", `${compared} actors compared`])}
${f.intro.map((p, i) => `<p${i === 0 ? ' class="lead"' : ""}>${esc(p)}</p>`).join("\n")}

<section class="section">${pulse()}
<h2>Our actors in this family</h2>
<div class="ledger">${f.ours.map(ourCard).join("\n")}</div>
</section>

<section class="section">${pulse()}
<h2>The field, side by side</h2>
<p>Every actor that appears in Apify store search for these terms, with the price its store page publishes for a free-plan account and for a Business-plan account. Our rows are shaded.</p>
${f.groups.map((g, i) => compTable(g, f, i)).join("\n")}
${vendorRows(f.vendors)}
</section>

<section class="section">${pulse()}
<h2>How to read it</h2>
<div class="key">${f.reading.map(p => `<p>${esc(p)}</p>`).join("\n")}</div>
</section>

<section class="section">${pulse()}
<h2>What we do not do</h2>
<ul class="list">${f.not.map(n => `<li>${esc(n)}</li>`).join("")}</ul>
</section>

<section class="section">${pulse()}
<h2>Run it your way</h2>
<ul class="list ways">
<li><b>Console</b>Open any store page above, fill the form, press Start. The free Apify plan covers test runs.</li>
<li><b>API</b>Every actor has a REST endpoint: <code>POST https://api.apify.com/v2/acts/steadyfetch~&lt;actor&gt;/run-sync-get-dataset-items?token=…</code> with the input as JSON. The API docs link on each card shows the exact body.</li>
<li><b>MCP</b>The "Pin to Apify MCP" link registers that one actor as a tool for Claude, Cursor or any MCP client.</li>
<li><b>n8n</b>Free, import-validated workflow templates for several actors live at <a href="https://github.com/steadyfetch/n8n-templates">steadyfetch/n8n-templates</a>.${f.dir === "ad-transcripts" ? ` One is published in the n8n community library too: <a href="https://n8n.io/workflows/19027-transcribe-facebook-ad-library-video-hooks-to-google-sheets-using-apify/" rel="noopener">Transcribe Facebook Ad Library video hooks to Google Sheets</a> — the same actor, wired end to end.` : ""}</li>
</ul>
</section>
` + foot(CHECKED);
}

// The proof: two specimens on one scale, and the competitor wins.
function proofBlock() {
  const jobs = FAMILIES.find(f => f.dir === "jobs");
  const mine = { id: "steadyfetch/indeed-jobs-scraper", v: OURS["indeed-jobs-scraper"].free, mine: true };
  const theirs = { id: "valig/indeed-jobs-scraper", v: C["valig/indeed-jobs-scraper"].free, mine: false };
  const max = Math.max(mine.v, theirs.v);
  const spec = (s) => `<div class="spec${s.mine ? " mine" : ""}">
<p class="who">${binomial(s.id)}</p>
<div class="track"><span class="rail"><span class="fill" style="--w:${((s.v / max) * 100).toFixed(1)}%"></span></span><span class="amt">${perK(s.v)}</span></div>
</div>`;
  return `<div class="proof">
<h2>Where a competitor is cheaper, the table says so.</h2>
<p class="sub">Indeed listings, free plan, per 1,000 — read from the store on ${CHECKED}.</p>
<div class="specimens">${spec(theirs)}${spec(mine)}</div>
<p class="verdict">${esc(jobs.reading[0])}</p>
<p class="verdict">${esc(jobs.reading[1])}</p>
<p class="more"><a href="/jobs/">See the whole jobs plate</a></p>
</div>`;
}

function indexPage() {
  const title = "Steadyfetch: honest comparison pages for data actors on Apify";
  const desc = "Five comparison pages, one per data family, listing every Apify actor and the main vendors next to Steadyfetch's 25 actors with the same price columns. Ad transcripts, Google Trends and keywords, jobs, Amazon, YouTube and media.";
  const jsonld = { "@context": "https://schema.org", "@type": "WebSite", name: "Steadyfetch", url: SITE, description: desc };
  // actors on the plate only — outside vendors are named separately and sit on no plate
  const size = (f) => f.ours.length + f.groups.reduce((n, g) => n + g.ids.length, 0);
  const widest = Math.max(...FAMILIES.map(size));
  return head(title, desc, "/", jsonld) + `
<h1>Data actors on Apify, compared honestly</h1>
${stampBand([`All prices read ${CHECKED}`, "Public Apify store API and vendor pricing pages", `${N_OURS} actors · ${N_COMP} competing actors · ${N_VEND} vendors`])}
<p class="lead">Steadyfetch builds 25 pay-per-event actors on the Apify platform. They share one rule: you are charged only when a row lands in your dataset, and a miss tells you why it was free. These pages put each family next to every competing actor and the main outside vendors, with the same price columns, so you can decide with the numbers in front of you.</p>

<section class="section first">${pulse()}
${proofBlock()}
</section>

<section class="section">${pulse()}
<div class="ledger">
${FAMILIES.map(f => `<article class="fam">
<h2><a href="/${f.dir}/">${esc(navLabel(f))}</a></h2>
<div class="meter">
<div><b>${size(f)}</b><span class="label">Actors on this plate</span></div>
<span class="gauge"><span style="--w:${((size(f) / widest) * 100).toFixed(1)}%"></span></span>
<p class="unitline">${f.ours.length} of ours · ${f.groups.reduce((n, g) => n + g.ids.length, 0)} competing${f.vendors.length ? ` · plus ${f.vendors.length} vendor${f.vendors.length > 1 ? "s" : ""} outside Apify, on no plate` : ""}</p>
</div>
<div class="act-main">
<p class="desc">${esc(f.desc.replace(/ Prices checked.*$/, ""))}</p>
<p class="roster">${f.ours.map(s => `<a href="${store(s)}">${esc(OURS[s].name)}</a>`).join("")}</p>
</div>
</article>`).join("\n")}
</div>
</section>

<section class="section">${pulse()}
<h2>What every Steadyfetch actor promises</h2>
<ul class="promise">
<li><b>Charged on delivery only</b>Expired links, blocked pages, empty results and unreadable media come back as rows with a status and <code>charged: false</code>.</li>
<li><b>Your caps are exact</b>A result limit of 30 returns 30. A run deadline stops the run cleanly and reports what is left.</li>
<li><b>No start fees, no minimums</b>Two exceptions are stated on their cards: an optional per-minute surcharge on videos longer than three minutes, and optional second events like Indeed descriptions.</li>
<li><b>Chainable</b>Every transcript actor accepts another scraper's dataset ID, so you can keep the scraper you already use.</li>
<li><b>Agent-ready</b>Each actor has a one-click MCP pin link and a REST endpoint; the store's agentic-payments allow-list covers all 25.</li>
</ul>
</section>

<section class="section">${pulse()}
<h2>Free n8n templates</h2>
<p>Import-validated workflows for the ad-transcript, keyword-volume and Instagram actors are at <a href="https://github.com/steadyfetch/n8n-templates">github.com/steadyfetch/n8n-templates</a>. No community nodes, plain HTTP, paste one token.</p>
</section>
` + foot(CHECKED);
}

mkdirSync(".", { recursive: true });
writeFileSync("index.html", indexPage());
for (const f of FAMILIES) { mkdirSync(f.dir, { recursive: true }); writeFileSync(`${f.dir}/index.html`, familyPage(f)); }
writeFileSync("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n<url><loc>${SITE}/</loc><lastmod>${ISO}</lastmod></url>\n${FAMILIES.map(f => `<url><loc>${SITE}/${f.dir}/</loc><lastmod>${ISO}</lastmod></url>`).join("\n")}\n</urlset>\n`);
writeFileSync("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
writeFileSync(".nojekyll", "");
console.log("built", 1 + FAMILIES.length, "pages");

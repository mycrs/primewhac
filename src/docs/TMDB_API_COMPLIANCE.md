# TMDB API Compliance & Best Practices

## Overview
This application strictly adheres to The Movie Database (TMDB) API Terms of Use. It implements robust security measures, rate limiting, and data validation to ensure a stable and compliant integration.

## 🚫 IMDb Scraping Prohibition
**SCRAPING IMDB IS STRICTLY PROHIBITED.**
- This application **does not** and **must not** scrape data from IMDb.com.
- All movie and TV metadata is sourced exclusively from the official TMDB API.
- Direct links to IMDb are for informational purposes only (e.g., `external_ids`) and are never used as data sources.
- The system includes an `imdbBlocker.js` utility that actively monitoring and blocks any outgoing requests to imdb.com domains within the API handling layer.

## ⚡ Rate Limiting
To respect TMDB's server load and prevent IP bans:
- **Limit:** 4 requests per second (Maximum).
- **Implementation:** `tmdbRateLimiter.js` uses a token bucket algorithm to queue requests.
- **Backoff:** Automatic exponential backoff is implemented for `429 Too Many Requests` responses.

## 🔒 Security Measures
- **API Keys:** Keys are stored in environment variables (`.env`) and never committed to version control.
- **Validation:** `apiKeyValidator.js` checks key format and presence on startup.
- **Sanitization:** All incoming text data is sanitized to prevent XSS vulnerabilities.

## 💾 Caching Strategy
To reduce unnecessary API calls:
- **Duration:** Data is cached in LocalStorage for 24 hours.
- **Fallback:** In case of API failure, stale cache data is served if available to maintain user experience.
- **Stats:** Cache hit/miss rates are monitored to optimize performance.

## 📊 Monitoring
- **Logging:** All API calls are logged with latency metrics in development mode.
- **Alerts:** High error rates (>20%) trigger console warnings.
- **Performance:** Response times are tracked to ensure UI responsiveness.

## Attribution
This product uses the TMDB API but is not endorsed or certified by TMDB.
![TMDB Logo](https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg)
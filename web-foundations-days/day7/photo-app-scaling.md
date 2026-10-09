SnapShare Scaling Architecture Plan

1. Assumptions and Daily Active Users (DAU)

- Total Registered Users: 10,000,000
- Activity Rate: 10% of registered users are active daily.
- Daily Active Users (DAU): $10,000,000 \times 0.10 = 1,000,000$ active users.
- User Activity Per Day: Each active user uploads 1 photo and views 50 feed pages.

2. Traffic and Storage Estimates

Traffic Calculations

- Total Uploads Per Day: $1,000,000 \text{ photos/day}$
- \Uploads Per Second (Average):
  \frac{1,000,000}{86,400 \text{ seconds}} \approx 11.57 \text{ uploads/sec}$$
- \Feed Views Per Day:\ $1,000,000 \text{ users} \times 50 \text{ views/day} = 50,000,000 \text{ feed views/day}$
- Feed Views Per Second (Average):
  $\frac{50,000,000}{86,400 \text{ seconds}} \approx 578.7 \text{ views/sec}$$
- Feed Views Per Second (Peak - 5× factor):
  $$578.7 \times 5 \approx 2,893.5 \text{ views/sec}$$

Storage Calculations (Per Year)

- Total Photos Per Year: $1,000,000 \text{ photos/day} \times 365 \text{ days} = 365,000,000 \text{ photos/year}$
- Original Photo Storage (2 MB each):
  $$365,000,000 \times 2 \text{ MB} = 730,000,000 \text{ MB} = 730 \text{ TB/year}$$
- Thumbnail Storage (50 KB each):
  $$365,000,000 \times 0.05 \text{ MB} = 18,250,000 \text{ MB} \approx 18.25 \text{ TB/year}$$
- Total Storage Required Per Year:
  $$730 \text{ TB} + 18.25 \text{ TB} = 748.25 \text{ TB/year}$$

3. Read-Heavy vs. Write-Heavy Analysis
   SnapShare is heavily read-heavy. While writes (uploads) occur at an average rate of ~12 writes per second, reads (feed views) happen at nearly 580 average requests per second and peak at ~2,894 requests per second.

Design Implications:

- We must optimize our read path using caching layers (Redis) and Content Delivery Networks (CDNs) to serve feeds and static assets quickly.
- We can scale our database using **read replicas** to handle the high volume of incoming read queries for user feeds and profiles without bottlenecking write operations.

4. Why Photos Should Not Be Stored in the Database
   Relational or traditional databases are optimized for structured tabular data, fast lookups, indexing, and transactional integrity (ACID). Storing massive binary blobs (like 2 MB image files) directly inside a database causes severe performance degradation, bloats backup sizes, consumes expensive memory/disk I/O, and makes database scaling extremely difficult.

Instead, photos should be stored in **distributed object storage** (such as AWS S3 or Google Cloud Storage), which is purpose-built for cost-effective, scalable binary file storage, while the database only stores metadata (file paths, captions, timestamps, and user IDs).

5. Architecture Diagram

```text
 [ Clients (Web/Mobile) ]
            │
            ▼
     [ Load Balancer ] ◄────────────── [ CDN (Cached Images/Thumbnails) ]
            │
            ├──────────────────────────┐
            ▼                          ▼
     [ App Servers ]            [ Object Storage ]
       (Node.js/Go)              (S3 - Photos & Thumbnails)
       │        │
       ▼        ▼
  [ Redis ]   [ Primary Database ] ──(Replication)──> [ Read Replica ]
  (Caching)   (Metadata/Writes)                         (Feed/Reads)
       │
       ▼
  [ Message Queue ] ──> [ Thumbnail Worker ] ──> (S3)
```

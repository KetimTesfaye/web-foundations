TicketHub System Design: Concert & Event Ticketing Architecture

1. Requirements

Functional Requirements

- Event Discovery: Users can browse and search upcoming concerts and events.
- Seat Selection: Users can view an interactive seat map showing real-time seat availability (available, held, booked).
- Seat Reservation (Hold): Users can temporarily lock a desired seat for a limited window (e.g., 10 minutes) while completing payment.
- Checkout & Payment: Users can securely purchase held seats and receive digital tickets.
- Ticket Management: Users can view their purchased tickets and confirmation history.

Non-Functional Requirements

- Correctness & Consistency (Zero Double-Booking): Absolute guarantee that two users can never successfully purchase or hold the exact same seat.
- High Concurrency & Flash Sale Resilience: The system must withstand sudden traffic spikes when high-demand tickets go on sale.
- Fairness: A first-come, first-served mechanism or a virtual waiting room to handle flash sales fairly without crashing infrastructure.
- Availability & Low Latency: Fast seat map rendering and sub-second checkout response times under normal operations.

2. Traffic & Load Estimates

Normal Day Traffic

- Registered Users: 2,000,000
- Daily Visitors: 50,000 visitors per day.
- Page Views: $50,000 \text{ visitors} \times 10 \text{ pages/day} = 500,000 \text{ views/day}$.
- Average Read Traffic:
  $$\frac{500,000}{86,400 \text{ seconds}} \approx 5.8 \text{ reads/sec}$$
- Tickets Sold: 5,000 tickets sold/day $\rightarrow$ Write traffic $\approx 0.06 \text{ writes/sec}$.

"Big Sale" Peak Traffic (Flash Sale Event)

- Scenario: 200,000 users attempt to buy 20,000 seats within the first 10 minutes (600 seconds).
- Peak Request Rate:
  $$\frac{200,000 \text{ concurrent users}}{600 \text{ seconds}} \approx 333 \text{ requests/sec (direct transaction attempts)}$$
- Note: Factoring in concurrent seat map refreshes and catalog browsing, edge and read traffic can easily surge to several thousand requests per second, requiring aggressive caching, CDN distribution, and a virtual waiting room queue.

3. REST API Design

| Method | Path                  | Description                                                  | Success Status |
| :----- | :-------------------- | :----------------------------------------------------------- | :------------- |
| GET    | `/events`             | List or search upcoming concerts and events.                 | `200 OK`       |
| GET    | `/events/{id}/seats`  | Retrieve real-time seat map and availability for an event.   | `200 OK`       |
| POST   | `/seats/hold`         | Temporarily place a 10-minute hold on a specific seat.       | `201 Created`  |
| POST   | `/orders`             | Process payment and finalize ticket purchase for held seats. | `201 Created`  |
| GET    | `/users/{id}/tickets` | Retrieve all purchased tickets for a user.                   | `200 OK`       |

4. Data Model & Database Schema

Entities & Tables

- `users`: Stores user profile data.
  - `id` (INT, PK, AUTO_INCREMENT)
  - `username` (VARCHAR(50), UNIQUE)
  - `email` (VARCHAR(100), UNIQUE)
- `events`: Stores concert and event details.
  - `id` (INT, PK, AUTO_INCREMENT)
  - `title` (VARCHAR(150), NOT NULL)
  - `venue` (VARCHAR(100))
  - `date` (DATETIME)
- `seats`: Stores individual seats linked to events and tracks live status.
  - `id` (INT, PK, AUTO_INCREMENT)
  - `event_id` (INT, FK referencing `events(id)`)
  - `seat_number` (VARCHAR(10), NOT NULL)
  - `status` (ENUM: 'available', 'held', 'booked')
  - `version` (INT, for optimistic locking control)
- `orders`: Stores transaction and ticket assignment details.
  - `id` (INT, PK, AUTO_INCREMENT)
  - `user_id` (INT, FK referencing `users(id)`)
  - `seat_id` (INT, FK referencing `seats(id)`, UNIQUE)
  - `status` (ENUM: 'pending', 'paid', 'cancelled')
  - `created_at` (DATETIME)

Relationships

- Event to Seats (One-to-Many): One event contains many individual seats.
- Seat to Orders (One-to-One): A seat can be tied to at most one active or completed order, enforced via a unique constraint.

5. Preventing Double-Booking (Concurrency Control)
   To prevent two users from buying the same seat during a high-demand flash sale, TicketHub utilizes a multi-layered concurrency strategy:
1. Atomic State Transitions in Redis / Database: When a user requests a hold (`POST /seats/hold`), the database executes an atomic conditional update:
   ```sql
   UPDATE seats
   SET status = 'held', version = version + 1
   WHERE id = 42 AND status = 'available';
   ```

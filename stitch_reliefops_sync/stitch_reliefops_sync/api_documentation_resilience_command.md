# API Documentation - Resilience Command

## Base URL
`http://localhost:8080/api`

## Endpoints

### Disasters
- `GET /api/disasters`: List all disasters.
- `POST /api/disasters`: Create a new disaster event.
- `PUT /api/disasters/{id}`: Update disaster details.
- `DELETE /api/disasters/{id}`: Delete a disaster (Restricted if children exist).

### Relief Camps
- `GET /api/camps`: List all relief camps.
- `POST /api/camps`: Create a new camp.
- `GET /api/camps/{id}`: Get details for a specific camp.

### Victims
- `GET /api/victims`: List all victims.
- `POST /api/victims`: Register a new victim (automatically increments camp occupancy).

### Resources & Allocations
- `GET /api/resources`: Current stock levels.
- `POST /api/donations`: Record a donation (updates total and available stock).
- `POST /api/allocations`: Request resource allocation for a camp.

### Shortage Monitoring
- `GET /api/shortages`: List camps with any shortage condition.
- `GET /api/shortages/urgent`: List only urgent shortage camps.

## Error Handling
Returns structured JSON:
```json
{
  "timestamp": "2023-10-27T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Insufficient resource quantity",
  "path": "/api/allocations"
}
```
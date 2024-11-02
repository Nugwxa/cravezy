# Backend

## Getting Started

To run the project's backend locally, follow these steps:

### Installation

1. Clone the repo(optional):

   ```bash
   git clone https://github.com/Nugwxa/chefs-kitchen.git
   ```

2. Change to the server directory:

   ```bash
   cd chefs-kitchen/server
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Update your .env file with the values from the .env.example file.

5. Run Prisma migrations:

   ```bash
   npx prisma migrate dev
   ```

### Running The Server

```bash
npm run serve
```

### Running Tests

```bash
npm test
```

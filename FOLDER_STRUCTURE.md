```
/app
  /api
    /auth
      /[...nextauth]
        /route.js       # NextAuth.js dynamic route
    /orders
      /route.js         # GET, POST for orders
      /[orderId]
        /route.js       # GET, PUT, DELETE for a specific order
    /products
      /route.js         # GET, POST for products
      /[productId]
        /route.js       # GET, PUT, DELETE for a specific product
    /rooms
      /route.js         # GET, POST for rooms
      /[roomId]
        /route.js       # GET, PUT, DELETE for a specific room
    /users
      /route.js         # GET, POST for users
      /[userId]
        /route.js       # GET, PUT, DELETE for a specific user
  /(auth)                # Group for authentication pages
    /login
      /page.js
    /register
      /page.js
  /(dashboard)           # Group for dashboard pages
    /admin
      /page.js
      /staff
        /page.js
    /supervisor
      /page.js
    /staff
      /page.js
  /components
    /ui                 # Reusable UI components (e.g., Button, Input, Card)
    /common             # Common components (e.g., Header, Footer)
    /dashboard          # Components specific to the dashboard
  /lib
    /db.js              # MongoDB connection
    /mongoose.js        # Mongoose setup
  /models
    /User.js
    /Order.js
    /Room.js
    /Product.js
  /providers
    /SessionProvider.js # NextAuth session provider
    /RealtimeProvider.js # Ably/Pusher provider
  /styles
    /globals.css
  /page.js              # Landing page
  /layout.js            # Root layout

/public
  /images
  /favicon.ico

/tests
  /api
  /components
  /e2e

.env.local
.gitignore
next.config.js
package.json
postcss.config.js
tailwind.config.js
```

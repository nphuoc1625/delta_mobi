# DeltaMobi

**DeltaMobi** is a modern, scalable web platform designed to streamline product, category, and order management for e-commerce and inventory-driven businesses.

## Purpose & Vision
DeltaMobi aims to provide a robust, flexible backend and admin interface for managing products, categories, and user orders. The platform is built for:
- E-commerce businesses
- Inventory managers
- Developers seeking a customizable, modular foundation for commerce applications

Our vision is to empower teams with a reliable, extensible system that supports rapid growth and evolving business needs.

## Core Features
- **Product Management:** Create, update, and organize products with rich metadata and images
- **Category & Group Category Management:** Hierarchical and flexible category structures
- **Order Management:** Track and manage customer orders (extensible for future needs)
- **Repository Pattern:** Clean separation of data access and business logic
- **Modern UI:** Responsive, accessible, and easy to use
- **Environment-based Configuration:** Seamless switching between development, staging, and production

## Tech Stack
- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes (Node.js)
- **Database:** MongoDB (with Mongoose ODM)
- **Language:** TypeScript
- **Deployment:** Vercel (optimized), Node.js server

## Architecture Overview
- **Monorepo Structure:** Modular organization for scalability
- **Repository Pattern:** All data access and business logic is encapsulated in repository modules
- **API-First:** Clean separation between UI and data layers
- **Documentation-Driven:** All business rules, requirements, and API contracts are documented in the `doc/` and `rules/` folders

## Learn More
- **Setup & Deployment:** See `doc/setup/`
- **Business Rules & Features:** See `doc/features/`
- **Contribution Guidelines:** See `rules/`

---

© DeltaMobi Project. Built with Next.js, MongoDB, and ❤️ 
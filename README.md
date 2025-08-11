# **Car Dealer App**  

Welcome to Car Dealers! We are a team of innovators, creators, and problem-solvers committed to crafting meaningful digital experiences. Our mission is to empower businesses and individuals by delivering high-quality, reliable, and scalable solutions that drive success in an ever-evolving digital landscape.

---

## **Table of Contents**  
1. [Our Mission](#our-mission)  
2. [Features](#features)  
3. [Tech Stack](#tech-stack)  
4. [Installation](#installation)  
5. [Folder Structure](#folder-structure)  
6. [Contributors](#contributors)  
7. [License](#license)  

---

## **Our Mission**  

At our core, we aim to bridge the gap between technology and creativity. Our goal is to provide transformative solutions that inspire trust and confidence in our clients, enabling them to achieve their objectives and reach new heights. With years of experience and a team of skilled professionals, we deliver tailored solutions that cater to your unique needs. From cutting-edge designs to robust development, we ensure every project is a masterpiece of excellence and innovation.

---

## **Features**    
- **Seamless Experience:** Users can easily sign up, log in, and manage their account through a user-friendly dashboard with real-time plan and usage tracking.  
- **Dashboards:** Seperate dashboards for admin and staff according to their roles.
- **Buying & Selling Plateform:** User can purchase or sell new and old cars (SUV's, Hatchback, Sedan, Coupe, Hybrid etc), advertise their ads by our premium services.
- **Multilingual supported:** Whole website is built with multilingual capabilities, allowing users to read content in multiple languages.
- **Car Leasing:** These themes include features like vehicle listings, lease calculators, lead generation forms, and booking integrations—ideal for dealerships and leasing agencies.
- **FAQ's:** Make sured to answer all of your queries from the FAQ's section.

---

## **Tech Stack**
- **Programing Languages:** Typescript, Next.js
- **Framework:** Flowbite, Tailwind Css, Redux Toolkit    
- **Database:** MongoDB, Firebase 
- **Payment Methods:** Stripe, Paypal
- **Authentication:** JSON Web Tokens (JWT), bcrypt  

---

## **Installation**  
Follow these steps to set up the project locally:

1. Clone the repository:  
   ```bash  
   git clone https://github.com/sysfoc/car-dealer-app-nextjs.git  
   cd car-dealer-app-nextjs 
   ```  

2. Install dependencies:  
   ```bash  
   npm install  
   ```  

3. Set up environment variables:  
   - Create a `.env` file in the `root` directory.  
   - Add the following variables:  
     ```env
     BASE_URL=your-domain-name
     MONGODB_URI=your-mongodb-url
     JWT_SECRET_KEY=your-jwt-key 
     ```  

4. Start the application:  
   ```bash  
   # Start the project  
   npm run dev  
   ```  
---

## **Folder Structure**  
```plaintext
car-dealer-app-nextjs/
├── .vscode/
├── app/
│   ├── page.jsx
│   └── (other routes)
├── components/
│   └── ui/
├── lib/
├── hooks/
├── public/
│   └── (static assets)
├── middleware.ts
├── .env.local
├── next.config.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── tsconfig.json
├── .gitignore
├── .prettierrc
├── components.json
├── README.md
```

---

## **Contributors**  
- **Sysfoc:** (https://github.com/sysfoc)
- **Hamza Ilyas:** (https://github.com/Hamza-fullstackdev)
- **Muhammad Ahmed:** (https://github.com/mahmed960)
- **Rehan Ahmad:** (https://github.com/RehanAhmad86)
---

## **License**  
This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.  

---

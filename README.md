# Smart Ambulance System

## Overview

This project is a comprehensive smart ambulance system with role-based dashboards for admins, hospital staff, and ambulance drivers. It includes real-time monitoring, emergency response coordination, and fleet management.

## Technologies Used

### Backend (ambulance-backend)
- Django 4.2.7
- Django REST Framework 3.14.0
- Django CORS Headers 4.3.1
- Python Decouple 3.8
- Pillow
- Django Extensions 3.2.3
- Requests 2.31.0
- Twilio 8.10.0
- SendGrid 6.10.0
- Django REST Auth 0.9.5
- Django Allauth 0.57.0
- Celery 5.3.4
- Redis 5.0.1
- Python Dotenv 1.0.0
- Cryptography 41.0.8
- PyJWT 2.8.0

### Frontend (ambulance-frontend)
- React 19.1.1
- React DOM 19.1.1
- React Router DOM 7.8.1
- Axios 1.11.0
- Socket.io Client 4.8.1
- Leaflet 1.9.4
- React Leaflet 5.0.0
- Lucide React 0.539.0
- Chart.js 4.5.0
- React Chartjs 2 5.3.0
- React Scripts 5.0.1
- Web Vitals 2.1.4

### Additional (Root)
- Chart.js 4.5.0
- React Chartjs 2 5.3.0

## Commands

### Backend Setup and Run
1. Navigate to backend directory: `cd ambulance-backend`
2. Create virtual environment: `python -m venv venv`
3. Activate virtual environment: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux/Mac)
4. Install dependencies: `pip install -r requirements.txt`
5. Run migrations: `python manage.py migrate`
6. Create demo users: `python manage.py create_demo_users`
7. Run server: `python manage.py runserver`

### Frontend Setup and Run
1. Navigate to frontend directory: `cd ambulance-frontend`
2. Install dependencies: `npm install`
3. Start development server: `npm start` (runs on port 3001)

### Testing
- Backend: `python manage.py test`
- Frontend: `npm test`

### Building for Production
- Frontend: `npm run build`

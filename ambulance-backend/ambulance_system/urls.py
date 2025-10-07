from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("""
    <h1>Smart Ambulance System API</h1>
    <p>Backend is running successfully!</p>
    <h3>Available URLs:</h3>
    <ul>
        <li><a href="/admin/">Admin Panel</a></li>
        <li><a href="/api/authentication/test-connection/">Test API</a></li>
    </ul>
    """)

urlpatterns = [
    path('', home, name='home'),
    path('admin/', admin.site.urls),
    path('api/authentication/', include('authentication.urls')),
    path('api/users/', include('users.urls')),
]
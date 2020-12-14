from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm

from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout

# Create your views here.

def signin(request):
    if request.user.is_authenticated:
        return redirect('schedule:home')

    if request.method == 'POST':
        form = AuthenticationForm(request, request.POST)

        if form.is_valid():
            user = form.get_user()
            auth_login(request, user)

            return redirect(request.POST.get('next') or 'schedule:home')

    return render(request, 'signin.html')

def signup(request):
    if request.user.is_authenticated:
        return redirect('schedule:home')
    
    if request.method == 'POST':
        form = UserCreationForm(request.POST)

        if form.is_valid():
            user = form.save()
            auth_login(request, user)

            return redirect('schedule:home')

    return render(request, 'signup.html')

def signout(request):
    if request.user.is_authenticated:
        auth_logout(request)

    return redirect('account:signin')
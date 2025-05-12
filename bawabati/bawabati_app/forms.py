from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import UserProfile, Course, Note

class UserProfileForm(forms.ModelForm):
    first_name = forms.CharField(max_length=30, required=False)
    last_name = forms.CharField(max_length=30, required=False)
    email = forms.EmailField(required=False)
    is_active = forms.BooleanField(required=False, initial=True)
    bio = forms.CharField(max_length=500, required=False)
    profile_picture = forms.ImageField(required=False)
    phone_number = forms.CharField(max_length=15, required=False)
    
    class Meta:
        model = UserProfile
        fields = ['bio', 'profile_picture', 'phone_number']
        widgets = {
            'profile_picture': forms.FileInput(attrs={'class': 'form-control'}),
        }
        
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Initialize user fields if instance exists
        if hasattr(kwargs.get('instance', None), 'user'):
            user = kwargs['instance'].user
            self.fields['first_name'].initial = user.first_name
            self.fields['last_name'].initial = user.last_name
            self.fields['email'].initial = user.email
            self.fields['is_active'].initial = bool(user.is_active)
    
    def save(self, commit=True):
        profile = super().save(commit=False)
        
        # Update user information with safe type handling
        user = profile.user
        user.first_name = self.cleaned_data.get('first_name', '')
        user.last_name = self.cleaned_data.get('last_name', '')
        user.email = self.cleaned_data.get('email', '')
        
        # Properly handle boolean field
        is_active = self.cleaned_data.get('is_active')
        user.is_active = bool(is_active)
        
        if commit:
            # Use update to bypass validation issues
            User.objects.filter(id=user.id).update(
                first_name=user.first_name,
                last_name=user.last_name,
                email=user.email,
                is_active=user.is_active
            )
            profile.save()
        
        return profile

class UserCreateForm(UserCreationForm):
    email = forms.EmailField(required=True)
    first_name = forms.CharField(required=True)
    last_name = forms.CharField(required=True)
    role = forms.ChoiceField(choices=UserProfile.ROLE_CHOICES, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password1', 'password2']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        user.first_name = self.cleaned_data['first_name']
        user.last_name = self.cleaned_data['last_name']
        
        if commit:
            user.save()
            user.userprofile.role = self.cleaned_data['role']
            user.userprofile.save()
        
        return user

class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = ['title', 'description', 'instructor', 'start_date', 'end_date', 'capacity']
        widgets = {
            'start_date': forms.DateInput(attrs={'type': 'date'}),
            'end_date': forms.DateInput(attrs={'type': 'date'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Only show teachers in the instructor field
        self.fields['instructor'].queryset = User.objects.filter(userprofile__role='teacher')

class NoteForm(forms.ModelForm):
    class Meta:
        model = Note
        fields = ['title', 'content', 'file', 'course'] 
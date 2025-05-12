from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from .models import UserProfile, Course, Note, Enrollment

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'profile'

class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'get_role', 'is_staff')
    list_filter = ('userprofile__role', 'is_staff', 'is_superuser', 'is_active')
    search_fields = ('username', 'first_name', 'last_name', 'email')

    def get_role(self, obj):
        return obj.userprofile.role if hasattr(obj, 'userprofile') else '-'
    get_role.short_description = 'Role'

class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'start_date', 'end_date', 'capacity', 'enrolled_count')
    list_filter = ('instructor', 'start_date', 'end_date')
    search_fields = ('title', 'description', 'instructor__username')
    date_hierarchy = 'start_date'

class NoteAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'uploaded_by', 'created_at')
    list_filter = ('course', 'uploaded_by', 'created_at')
    search_fields = ('title', 'content', 'course__title', 'uploaded_by__username')
    date_hierarchy = 'created_at'

class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'enrollment_date', 'status')
    list_filter = ('status', 'enrollment_date', 'course')
    search_fields = ('student__username', 'course__title')
    date_hierarchy = 'enrollment_date'

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

# Register other models
admin.site.register(Course, CourseAdmin)
admin.site.register(Note, NoteAdmin)
admin.site.register(Enrollment, EnrollmentAdmin) 
from django.test import TestCase, override_settings
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from learning_centers.models import Educenters, Application, Courses
from users_control.models import Roles
from django.urls import reverse

User = get_user_model()

@override_settings(SECURE_SSL_REDIRECT=False)
class VisibilityTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        
        # Create roles
        self.admin_role, _ = Roles.objects.get_or_create(name='admin')
        self.user_role, _ = Roles.objects.get_or_create(name='user')
        self.owner_role, _ = Roles.objects.get_or_create(name='edu_owner')
        
        # Create users
        self.admin_user = User.objects.create_superuser(username='admin', password='password', phone_number='1')
        self.owner_user = User.objects.create_user(username='owner', password='password', phone_number='2', role=self.owner_role)
        self.student_user = User.objects.create_user(username='student', password='password', phone_number='3', role=self.user_role)
        
        # Create course and center
        self.course = Courses.objects.create(title='Python')
        self.center = Educenters.objects.create(name='Coding Academy', owner=self.owner_user)
        
        # Create application
        self.app = Application.objects.create(owner=self.student_user, center=self.center, course=self.course)
        
        self.url = reverse('educenters-applications-list')

    def test_owner_sees_application(self):
        self.client.force_authenticate(user=self.owner_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.app.id)

    def test_admin_sees_application(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['id'], self.app.id)

    def test_other_user_does_not_see_application(self):
        other_owner = User.objects.create_user(username='other_owner', password='password', phone_number='4', role=self.owner_role)
        self.client.force_authenticate(user=other_owner)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 0)

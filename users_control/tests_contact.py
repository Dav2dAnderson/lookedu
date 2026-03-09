from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from users_control.models import ContactMessage

class ContactMessageTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = '/contact/' # Or reverse('contact') if named

    def test_send_contact_message_success(self):
        data = {
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "message": "Hello, this is a test message."
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertEqual(ContactMessage.objects.first().first_name, "John")

    def test_send_contact_message_invalid_data(self):
        data = {
            "first_name": "John",
            # missing fields
        }
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

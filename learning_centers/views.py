from django.shortcuts import render

from rest_framework import viewsets, permissions, parsers

from .models import Educenters, Application, Courses
from .serializers import CentersListSerializer, CentersRetrieveSerializer, ApplicationsSerializer, CoursesSerializer
from .permissions import IsOwnerOrAdmin, IsEduOwner, HaveARightToAdd

# Create your views here.


class CentersView(viewsets.ModelViewSet):
    queryset = Educenters.objects.all()
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return CentersListSerializer
        elif self.action == 'retrieve':
            return CentersRetrieveSerializer
        return CentersRetrieveSerializer
    
    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [permissions.IsAdminUser | IsEduOwner | HaveARightToAdd]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ApplicationsView(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationsSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrAdmin]
    lookup_field = 'index'

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_queryset(self):
        return self.request.user.applies.all()
    

class CoursesView(viewsets.ModelViewSet):
    queryset = Courses.objects.all()
    serializer_class = CoursesSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'slug'

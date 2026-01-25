from django.shortcuts import render

from rest_framework import viewsets

from .models import Educenters
from .serializers import CentersListSerializer, CentersRetrieveSerializer
# Create your views here.


class CentersView(viewsets.ModelViewSet):
    queryset = Educenters.objects.all()
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return CentersListSerializer
        elif self.action == 'retrieve':
            return CentersRetrieveSerializer
        return CentersRetrieveSerializer
    

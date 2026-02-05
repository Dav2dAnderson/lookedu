from rest_framework import serializers

from django.urls import reverse

from .models import Educenters, Courses, Application

from users_control.serializers import UserShortSerializer
from users_control.models import CustomUser



class CoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = ['id', 'title', 'slug']



class CentersListSerializer(serializers.ModelSerializer):
    detail_url = serializers.SerializerMethodField()

    class Meta:
        model = Educenters
        fields = ['id', 'name', 'slug', 'info', 'phone_number', 'picture', 'cost', 'detail_url']

    def get_detail_url(self, obj):
        request = self.context.get('request')

        url = reverse("educenters-detail", kwargs={'slug': obj.slug})
        return request.build_absolute_uri(url) if request else url


class CentersRetrieveSerializer(serializers.ModelSerializer):
    courses = CoursesSerializer(many=True, read_only=True)

    course_ids = serializers.PrimaryKeyRelatedField(
        source='courses',
        queryset=Courses.objects.all(),
        many=True,
        write_only=True
    )

    class Meta:
        model = Educenters
        fields = ['id', 'name', 'info', 'phone_number', 
                  'phone_number_extra', 'courses', 'cost', 
                  'official_website', 'picture', 'course_ids']



class ApplicationsSerializer(serializers.ModelSerializer):
    owner = UserShortSerializer(read_only=True)
    center = CentersRetrieveSerializer(read_only=True)
    course = CoursesSerializer(read_only=True)

    center_id = serializers.PrimaryKeyRelatedField(
        source='center',
        queryset=Educenters.objects.all(),
        write_only=True
    )

    course_id = serializers.PrimaryKeyRelatedField(
        source='course',
        queryset=Courses.objects.all(),
        write_only=True
    )

    class Meta:
        model = Application
        fields = ['id', 'owner', 'center', 'course', 'content', 'index', 'center_id', 'course_id', 'created_date']

        
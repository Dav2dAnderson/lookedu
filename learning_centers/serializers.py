from rest_framework import serializers

from .models import Educenters, Courses, Application

from users_control.serializers import UserShortSerializer
from users_control.models import CustomUser



class CoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = ['title', 'slug']


class CentersListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Educenters
        fields = ['id', 'name', 'slug']


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
        fields = ['name', 'info', 'phone_number', 'phone_number_extra', 'courses', 'course_ids']


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
        fields = ['owner', 'center', 'course', 'index', 'center_id', 'course_id']

        
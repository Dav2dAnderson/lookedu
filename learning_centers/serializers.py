from rest_framework import serializers

from .models import Educenters, Courses


class CoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = ['title', 'slug']


class CentersListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Educenters
        fields = ['name', 'slug']


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
        fields = ['name', 'bio', 'phone_number', 'phone_number_extra', 'courses', 'course_ids']



        
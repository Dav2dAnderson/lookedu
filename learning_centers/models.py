from django.db import models
from django.utils.text import slugify
# Create your models here.


""" EDU centers' courses """
class Courses(models.Model):
    title = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, null=True, blank=True, unique=True)

    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        return super().save(*args, **kwargs)

    class Meta:
        verbose_name = 'Course'
        verbose_name_plural = 'Courses'


""" Education centers """
class Educenters(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=120, null=True, blank=True, unique=True)
    courses = models.ManyToManyField(Courses, related_name='courses', blank=True)
    bio = models.TextField(null=True, blank=True)
    phone_number = models.CharField(max_length=13, null=True, blank=True)
    phone_number_extra = models.CharField(max_length=13, null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        return super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = 'Educenter'
        verbose_name_plural = 'Educenters'

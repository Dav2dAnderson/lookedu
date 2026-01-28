from django.db import models, transaction, IntegrityError
from django.utils.text import slugify
from django.db.models import Max

from users_control.models import CustomUser

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
    courses = models.ManyToManyField(Courses, related_name='educenters', blank=True)
    info = models.TextField(null=True, blank=True)
    phone_number = models.CharField(max_length=13, null=True, blank=True)
    phone_number_extra = models.CharField(max_length=13, null=True, blank=True)

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        return super().save(*args, **kwargs)
    
    class Meta:
        verbose_name = 'Educenter'
        verbose_name_plural = 'Educenters'


class Application(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="applies")
    center = models.ForeignKey(Educenters, on_delete=models.CASCADE, related_name="applies")
    course = models.ForeignKey(Courses, on_delete=models.CASCADE, related_name='applies')
    index = models.PositiveIntegerField(editable=False, null=True, blank=True, unique=True)
    content = models.TextField(null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.owner.username
    
    def save(self, *args, **kwargs):
        if self.pk and self.index is None:
            return super().save(*args, **kwargs)
        
        for _ in range(5):
            try:
                with transaction.atomic():
                    max_index = Application.objects.aggregate(max_i=Max("index"))["max_i"] or 0 # SELECT MAX(index) AS max_i FROM model_name;
                    self.index = max_index + 1
                    return super().save()
            except IntegrityError:
                continue
        raise IntegrityError("Could not assign a unique index after several retries")
    
    class Meta:
        verbose_name = 'Application'
        verbose_name_plural = 'Applications'
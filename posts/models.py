from django.db import models
from django.core.urlresolvers import reverse
from django.contrib.postgres.fields import JSONField

# Create your models here.

class Post(models.Model):
	title = models.CharField(max_length=120)
	content = models.TextField()
	updated = models.DateTimeField(auto_now=True, auto_now_add=False)
	timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)
	image = models.ImageField(upload_to="post/", null=True, blank=True)
	video = models.CharField(max_length=120, null=True, blank=True)
	link = models.CharField(max_length=120, null=True)
	bullets =JSONField(null=True)
	ios = models.BooleanField(default=False)
	android = models.BooleanField(default=False)
	webapp = models.BooleanField(default=False)
	desktopapp = models.BooleanField(default=False)

	def __str__(self):
		return self.title

	def get_absolute_url(self):
		return reverse("posts:detail", kwargs={"id": self.id})

	class Meta:
		ordering = ["-timestamp", "-updated"]
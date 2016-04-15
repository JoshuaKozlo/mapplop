from django.contrib import messages
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render, get_object_or_404, redirect

from .forms import PostForm
from .models import Post

# Create your views here.

def post_detail(request, slug):
	instance = get_object_or_404(Post, slug=slug)
	context = {
		"title": instance.title,
		"instance": instance,
	}
	return render(request, 'post_detail.html', context)

def post_list(request):
	queryset = Post.objects.all().order_by("-timestamp")
	context = {
		"title": "List",
		"object_list": queryset,
	}
	return render(request, 'post_list.html', context)
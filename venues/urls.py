from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.home),
    url(r'^themap/', views.map),
    url(r'^addvenue/', views.addVenue),
    url(r'^removevenue/', views.removeVenue),
    url(r'^getCities/', views.getCities),
    url(r'^getVenues/', views.getVenues),
    url(r'^getCity/', views.getCity),
    url(r'^promo/(?P<state>\w{2})/(?P<city>[\w ]+)', views.promo),
] 
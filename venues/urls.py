from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.map),
    url(r'^modifyvenues/$', views.modifyVenues),
    url(r'^modifyvenues/thanks/', views.thanks),
    url(r'^getCities/', views.getCities),
    url(r'^getVenues/', views.getVenues),
    url(r'^getCity/', views.getCity),
    url(r'^(?P<state>\w{2})/(?P<city>[\w ]+)', views.promo),
] 
# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-03-29 00:04
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0006_post_video'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='video',
            field=models.CharField(blank=True, max_length=120, null=True),
        ),
    ]

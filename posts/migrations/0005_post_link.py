# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-03-20 01:48
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0004_post_bullets'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='link',
            field=models.CharField(max_length=120, null=True),
        ),
    ]

# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-04-15 23:40
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0011_auto_20160415_1707'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='pricing',
            field=models.TextField(default='Blank'),
        ),
        migrations.AddField(
            model_name='post',
            name='tutorial',
            field=models.TextField(default='Blank'),
        ),
    ]

from django.db import models


from django.db import models


class SiteTheme(models.Model):
    name = models.CharField(max_length=100)
    bg_color = models.CharField(max_length=7)
    second_bg_color = models.CharField(max_length=7)
    text_color = models.CharField(max_length=7)
    main_color = models.CharField(max_length=7)

    def __str__(self):
        return self.name



class Hero(models.Model):
    greeting = models.CharField(max_length=100, default="Hello, It's Me")
    name = models.CharField(max_length=100)
    description = models.TextField()
    tagline = models.TextField(help_text="Comma-separated job roles for typing effect", default="Web Developer, Designer")
    github = models.URLField(blank=True, null=True)
    linkedin = models.URLField(blank=True, null=True)
    twitter = models.URLField(blank=True, null=True)
    email = models.EmailField()
    cv = models.FileField(upload_to='cv/', blank=True, null=True)
    image = models.ImageField(upload_to='hero/')

    def __str__(self):
        return f"Hero Section - {self.name}"



class About(models.Model):
    heading = models.CharField(max_length=200)
    description = models.TextField()
    long_description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='about/')
    bgimage = models.ImageField(upload_to='about/', blank=True, null=True)

    name = models.CharField(max_length=100, default='Your Name')
    age = models.PositiveIntegerField(default=18)
    address = models.CharField(max_length=300, default='Your Address')
    email = models.EmailField(default='you@example.com')
    phone = models.CharField(max_length=15, default='0000000000')
    occupation = models.CharField(max_length=100, default='Student')

    def __str__(self):
        return self.heading
   

class Service(models.Model):
    title = models.CharField(max_length=100)
    short_description = models.TextField()
    icon = models.CharField(max_length=100) 
    created_at = models.DateTimeField(auto_now_add=True,blank=True, null=True)


    def __str__(self):
        return self.title


class Booking(models.Model):
    name=models.CharField(max_length=100)
    email=models.EmailField()
    service=models.CharField(max_length=100)
    message=models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.name} - {self.service}"


class Project(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(max_length=300)
    image = models.ImageField(upload_to='project_thumbnails/')
    link = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    

class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    mobile = models.CharField(max_length=15, blank=True)
    subject = models.CharField(max_length=200, blank=True)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.email}"



# Create your models here.

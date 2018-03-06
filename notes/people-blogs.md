# People - Blogs - Blog Posts

``` javascript
Person
  id
  name
  email

Blog
  id
  owner: Person
  editors: [ Person, ... ]

Post
  id
  author: Person
  blog: Blog
  title
  body
```

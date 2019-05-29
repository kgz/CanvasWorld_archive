### Polynomial, Type C


```JS
x[+1]= xa + x * (xb + xc * x + xd * y) + y * (xe + xf * y)
y[+1]= ya + yb + yc * z + yd * Math.abs(x) + ye * Math.abs(y) + yf * Math.abs(z)
z[+1]= za + z*(zb + zc * z + zd * x) + x * (ze + zf * x)
```

````JS
a = 1.5607
b = 1.0405
c = 0.5419
d = 0.2818
e = 1.5390000000000001
f = 1.6257000000000001
````

![samplegif](sample.gif)
### Aizawa Attractor

 ```js
dx = (z - b) * x - d * y;
dy =  d * x + (z - b) * y;
dz =  c + a * z - ((z*z*z) / 3) - (x*x + y*y) *	(1 + e * z) + f * z * (x*x*x);
```
```js
a = 0.92125, b = 0.715, c = 0.531;
d = 4.11,    e = 0.281, f = 0.119;

x[0] = 0.1, y[0] = 0, z[0] = 0;
```

![samplegif](sample.gif)


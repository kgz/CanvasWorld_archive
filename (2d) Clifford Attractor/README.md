### (2d) Clifford Attractor
```JS
x[0] = 0.1;
y[0] = 0.1;

a, b, c, d = [-3..3];

x = Math.sin(a * y) + c * Math.cos(a * x);
y = Math.sin(b * x) + d * Math.cos( b * y);
```



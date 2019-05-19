### Fractal Dream Attractor
```JS
x[n+1] = Math.sin(b * y) + c * Math.sin(b * x)
y[n+1] = Math.sin(a * x) + d * Math.sin(a * y)
```

```JS
x[0], y[0] = -2
a, b, c, d = 0..3 
```
![samplegif](sample.gif)

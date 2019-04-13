### Gumowski-Mira Attractor

  Gumowski-Mira Attractor is an equation used to calculate the trajectories of sub-atomic particles
 
```js
x(n) = b * y * w
y(n) = w - t;
```

where 

```js
w := a * x + (1-a) * 2 * x * x/(1+x*x)
init = x[0] = 1, y[0] = 0.5;
a, b = -1..1;
```


![alt][logo]

[logo]:sample.gif ""

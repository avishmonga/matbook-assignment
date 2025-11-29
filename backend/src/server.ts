import app from "./app";

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

app.listen(PORT, () => {
  console.log(`MatBook backend listening on http://localhost:${PORT}`);
});
export class Util {
  async getData(url) {
    const response = await fetch(url, {
      method: "GET",
    });
    return response.json();
  }

  debounce(fn, delay) {
    let timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(), delay);
    };
  }
}

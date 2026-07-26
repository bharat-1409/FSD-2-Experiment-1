export function mockPublish(postData) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = Math.random() > 0.4;

      if (success) {
        resolve({
          message: "Post published successfully!",
          data: postData,
        });
      } else {
        reject({
          message: "Network Error",
        });
      }
    }, 2000);
  });
}
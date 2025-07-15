const handleLogout = async () => {
  try {
    const token = localStorage.getItem("authToken");
    await axios.post(
      'https://9464e8fe4567.ngrok-free.app/v1/logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    localStorage.clear();
    navigate("/login");
  } catch (error) {
    console.error("Logout gagal:", error.response?.data || error.message);
  }
};

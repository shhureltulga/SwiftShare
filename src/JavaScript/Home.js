import React, { useState, useEffect } from "react";
import { Navigate } from "react-router";
import { fetchData, createItem, updateStatus } from "../Data/data.jsx";
import { Modal, Button, Form, Spinner, Table, Badge } from "react-bootstrap";
import "../Css/Home.css"; // Custom CSS 

function App() {
  const [datas, setDatas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const generateCode = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return Array.from({ length: 12 }, () =>
      characters.charAt(Math.floor(Math.random() * characters.length))
    ).join("");
  };

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    sDate: "",
    fDate: "",
    status: false,
    code: generateCode(),
    empid: sessionStorage.getItem("empid"),
    personname: sessionStorage.getItem("personname"),
    file: null,
  });

  const [redirect, setRedirect] = useState({
    sendRedirect: false,
    recieveRedirect: false,
    loginRedirect: false,
  });

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const get = async () => {
    try {
      const fetchedData = await fetchData(sessionStorage.getItem("empid"));
      setDatas(fetchedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    get();
    if (!sessionStorage.getItem("sid")) {
      setRedirect((prev) => ({ ...prev, loginRedirect: true }));
    }
  }, []);

  const handleAddItem = async () => {
    setUploading(true);
    try {
      if (!newItem.name.trim() || !newItem.sDate || !newItem.fDate) {
        alert("Бүх шаардлагатай талбарыг бөглөнө үү.");
        setUploading(false);
        return;
      }

      const formData = new FormData();
      Object.keys(newItem).forEach((key) => {
        if (key !== "file" && newItem[key]) {
          formData.append(key, newItem[key]);
        }
      });

      if (newItem.file) {
        formData.append("file", newItem.file);
      }

      await createItem(formData);
      get();
      handleClose();
      setNewItem({
        name: "",
        description: "",
        sDate: "",
        fDate: "",
        status: false,
        code: generateCode(),
        empid: sessionStorage.getItem("empid"),
        file: null,
      });
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setUploading(false);
    }
  };

  if (redirect.loginRedirect) {
    return <Navigate to="/login" />;
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = datas.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(datas.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mt-4">
      <Button variant="primary" className="mb-3" onClick={handleShow}>
        📂 Файл нэмэх
      </Button>

      {/* Modal Window for Adding File */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>📁 Файл нэмэх</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>📄 Файлын нэр</Form.Label>
              <Form.Control type="text" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label>📝 Тайлбар</Form.Label>
              <Form.Control type="text" value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>📅 Огноо</Form.Label>
              <div className="d-flex gap-3">
                <Form.Control type="date" value={newItem.sDate} onChange={(e) => setNewItem({ ...newItem, sDate: e.target.value })} />
                <Form.Control type="date" value={newItem.fDate} onChange={(e) => setNewItem({ ...newItem, fDate: e.target.value })} />
              </div>
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>📁 Файл оруулах (.zip)</Form.Label>
              <Form.Control type="file" accept=".zip" onChange={(e) => setNewItem({ ...newItem, file: e.target.files[0] })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>❌ Болих</Button>
          <Button variant="primary" onClick={handleAddItem} disabled={uploading}>
            {uploading ? <Spinner animation="border" size="sm" /> : "✅ Нэмэх"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Data Table */}
      {loading ? (
        <Spinner animation="border" />
      ) : (
        <Table striped bordered hover responsive className="text-center">
          <thead className="table-dark">
            <tr>
              <th>Ажилтан</th>
              <th>Файлын нэр</th>
                    <th>Тайлбар</th>
                    <th>Эхлэх огноо</th>
                    <th>Дуусах огноо</th>
                    <th>Хоног</th>
                    <th>Файлын хэмжээ</th>
                    <th>Татах линк</th>
                    <th>Төлөв</th>
                    <th>Код</th>
            </tr>
          </thead>
          <tbody>
                  {currentItems.map((item) => {
                    const sDate = item.sDate ? new Date(item.sDate) : null;
                    const fDate = item.fDate ? new Date(item.fDate) : null;
                    const daysBetween =
                      sDate && fDate
                        ? Math.ceil(
                            (fDate - sDate) / (1000 * 60 * 60 * 24)
                          )
                        : "N/A";
                    return (
                      <tr key={item._id}>
                      <td>{item.personname}</td>
                        <td>{item.name}</td>
                        <td>{item.description}</td>
                        <td>
                          {sDate
                            ? sDate.toISOString().split("T")[0]
                            : "N/A"}
                        </td>
                        <td>
                          {fDate
                            ? fDate.toISOString().split("T")[0]
                            : "N/A"}
                        </td>
                        <td>{daysBetween} хоног</td>
                        <td>
                          {item.file && item.file.fileSize
                            ? `${(item.file.fileSize / (1024 * 1024)).toFixed(
                                2
                              )} MB`
                            : "N/A"}
                        </td>
                        <td>
  {item.file && item.file.filePath && item.status===true ? (
    <Button
      variant="success"
      onClick={() => {
        const downloadLink = `http://192.168.167.66:3010/api/test/download/${item.file.fileName}`;

        // Clipboard дэмжлэгийг шалгах
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(downloadLink)
            .then(() => alert("Линк хууллаа!"))
            .catch((error) => {
              console.error("Линк хуулахад алдаа гарлаа:", error);
              alert("Линк хуулах боломжгүй байна.");
            });
        } else {
          // Хуучин арга (textarea ашиглах)
          const tempInput = document.createElement("textarea");
          tempInput.value = downloadLink;
          document.body.appendChild(tempInput);
          tempInput.select();
          try {
            document.execCommand("copy"); // Линкийг хуулна
            alert("Линк хууллаа!");
          } catch (err) {
            console.error("Хуулж чадсангүй:", err);
            alert("Линк хуулах боломжгүй байна.");
          }
          document.body.removeChild(tempInput);
        }
      }}
    >
      Линк
    </Button>
  ) : (
    "Татах боломжгүй"
  )}
</td>

<td>
  {item.status === true ? (
    "Батлагдсан"
  ) : sessionStorage.getItem("empid") === "1599050755442" ? (
    <Button
      variant="success"
      onClick={async () => {
        try {
          await updateStatus(item._id, { status: true }); // Статус шинэчлэх API дуудах
          get(); // Жагсаалтыг дахин татах
        } catch (error) {
          console.error("Error updating status:", error);
        }
      }}
    >
      Батлах
    </Button>
  ) : (
    "Хүлээгдэж байна"
  )}
</td>

                        <td>{item.code}</td>
                      </tr>
                    );
                  })}
                </tbody>
        </Table>
      )}
    </div>
  );
}

export default App;

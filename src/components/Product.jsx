import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Flex,
  Text,
  Stack,
  Heading,
  Button,
  ButtonGroup,
  Divider,
  Image,
  Card,
  CardBody,
  CardFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import { darkTheme, lightTheme } from "../utils/Theme";

const Product = ({ videoId, darkMode, userId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const [products, setProducts] = useState([]);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [productImg, setProductImg] = useState("");
  const [productUrl, setProductUrl] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/product/${videoId}`
      );
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoId]);

  const openAddProductModal = () => {
    setIsAddingProduct(true);
  };

  const closeAddProductModal = () => {
    setIsAddingProduct(false);
    setTitle("");
    setPrice("");
    setProductImg("");
    setProductUrl("");
  };

  const handleAddProduct = async () => {
    try {
      const newProduct = {
        title,
        price,
        productimg: productImg,
        producturl: productUrl,
        video_id: videoId,
      };
      await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/product`,
        newProduct,
        {
          withCredentials: true,
        }
      );
      closeAddProductModal();
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Box maxW="120vh" mt="20px" overflow="hidden">
      {products.length > 0 ? (
        <Flex direction="row" flexWrap="wrap" p={4} rounded="md" boxShadow="md">
          {products.map((product) => (
            <Card
              key={product._id}
              maxW="sm"
              borderWidth="1px"
              rounded="md"
              m={2}
              bg={darkMode ? darkTheme.bgLighter : lightTheme.bgLighter}
            >
              <CardBody>
                <Image
                  src={product.productimg}
                  alt={product.title}
                  borderRadius="lg"
                  minH="2xs"
                  maxH="xs"
                  width="100%"
                  align="center"
                />
                <Stack mt="6" spacing="3">
                  <Heading
                    size="md"
                    color={darkMode ? darkTheme.textSoft : lightTheme.textSoft}
                  >
                    {product.title}
                  </Heading>
                  <Text color="blue.600" fontSize="2xl">
                    Rp {product.price}
                  </Text>
                </Stack>
              </CardBody>
              <Divider />
              <CardFooter>
                <ButtonGroup spacing="2">
                  <Button variant="solid" colorScheme="blue">
                    Buy now
                  </Button>
                  <Button variant="ghost" colorScheme="blue">
                    Add to cart
                  </Button>
                  <Button
                    as="a"
                    href={product.producturl}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outline"
                    colorScheme="blue"
                  >
                    View Product
                  </Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          ))}
          {currentUser._id === userId ? (
            <Button
              m={2}
              variant="solid"
              colorScheme="blue"
              onClick={openAddProductModal}
            >
              Add Product
            </Button>
          ) : null}
        </Flex>
      ) : (
        <Text mt="4" textAlign="center" color="gray.500">
          No products available yet.
        </Text>
      )}
      <Modal isOpen={isAddingProduct} onClose={closeAddProductModal}>
        <ModalOverlay />
        <ModalContent
          bg={darkMode ? darkTheme.bgLighter : lightTheme.bgLighter}
        >
          <ModalHeader
            m={2}
            color={darkMode ? darkTheme.text : lightTheme.text}
          >
            Add Product
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              m={2}
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                color: darkMode ? darkTheme.text : lightTheme.text,
                backgroundColor: darkMode
                  ? darkTheme.bgLighter
                  : lightTheme.bgLighter,
              }}
            />
            <Input
              m={2}
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              style={{
                color: darkMode ? darkTheme.text : lightTheme.text,
                backgroundColor: darkMode
                  ? darkTheme.bgLighter
                  : lightTheme.bgLighter,
              }}
            />
            <Input
              m={2}
              placeholder="Product Image URL"
              value={productImg}
              onChange={(e) => setProductImg(e.target.value)}
              style={{
                color: darkMode ? darkTheme.text : lightTheme.text,
                backgroundColor: darkMode
                  ? darkTheme.bgLighter
                  : lightTheme.bgLighter,
              }}
            />
            <Input
              m={2}
              placeholder="Product URL"
              value={productUrl}
              onChange={(e) => setProductUrl(e.target.value)}
              style={{
                color: darkMode ? darkTheme.text : lightTheme.text,
                backgroundColor: darkMode
                  ? darkTheme.bgLighter
                  : lightTheme.bgLighter,
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button m={2} colorScheme="blue" onClick={handleAddProduct}>
              Add
            </Button>
            <Button onClick={closeAddProductModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Product;

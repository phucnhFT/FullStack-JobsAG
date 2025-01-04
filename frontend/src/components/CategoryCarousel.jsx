import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/JobSlice.js";
import axios from "axios";
import { CATEGORY_API } from "@/utils/constant";

export default function CategoryCarousel() {
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${CATEGORY_API}/get-categories`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setCategories(response.data.categories);
      } else {
        console.error("Không thể tìm được danh mục");
      }
    } catch (error) {
      console.error("Lỗi khi tìm kiếm công việc theo danh mục:", error);
    }
  };

  const searchJob = (categoryId) => {
    dispatch(setSearchedQuery(categoryId));
    navigate("/browse");
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div>
      <Carousel className="w-full max-w-xl mx-auto my-20">
        <CarouselContent>
          {categories.map((cat) => (
            <CarouselItem
              key={cat._id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4"
            >
              <Button
                onClick={() => searchJob(cat._id)}
                variant="outline"
                className="rounded-full w-full"
              >
                {cat.name}
              </Button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

/* 테스트 코드 페이지 */
/*
 * 사용 목적
 * - 코드가 길어짐에 따라 기능 적용이 안되는 경우, 해당 페이지를 통해 직접 테스트하기 위함.
 *
 *
 *
 *
 */
import React, { useRef } from "react";
import Select from "react-select";

const TestPage = () => {
  const selectRef1 = useRef(null);
  const selectRef2 = useRef(null);

  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
  ];

  return (
    <section name="match" className="flex w-full h-screen">
      <div className="flex flex-col justify-center items-center w-[500px] h-[500px] bg-blue-500 m-auto">
        <Select
          ref={selectRef1}
          options={options}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault(); // Enter 키의 기본 동작 방지
              selectRef2.current.focus(); // 다음 react-select 컴포넌트로 포커스 이동
            }
          }}
          className="mb-5"
        />
        <Select
          ref={selectRef2}
          options={options}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault(); // Enter 키의 기본 동작 방지
              selectRef1.current.focus(); // 이전 react-select 컴포넌트로 포커스 이동
            }
          }}
        />
      </div>
    </section>
  );
};

export default TestPage;

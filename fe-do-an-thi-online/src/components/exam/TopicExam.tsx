// import { useEffect, useState } from "react";
// import { CardExam } from "../card/CardExam";
// import { InputAnswer } from "../input/InputAnswer";
// import { Timestamp } from "../time";
// import { useExamStore } from "@/store/exam-store";
// import Dropdown from "../userDropdown/Dropdown";
// import { Status, statusArray } from "@/utils/type";

// export type TopicExamProps = {
//   valueDescription?: string;
//   valueTopic?: string;
//   valueDropdown?: string;
//   valueExamTime?: string;
// };

// export const TopicExam = ({
//   valueDescription,
//   valueTopic,
//   valueDropdown,
//   valueExamTime,
// }: TopicExamProps) => {
//   const { updateExam, exam } = useExamStore();
//   const [topic, setTopic] = useState(valueTopic ?? "");
//   const [description, setDescription] = useState(valueDescription ?? "");

//   useEffect(() => {
//     if (valueTopic !== undefined) {
//       setTopic(valueTopic);
//     }
//     if (valueDescription !== undefined) {
//       setDescription(valueDescription);
//     }
//   }, [valueTopic, valueDescription]);

//   const onChangeTopic = (e: string) => {
//     updateExam({ topic: e });
//   };
//   const onChangeExamTime = (e: number) => {
//     updateExam({ examTime: Number(e) });
//   };
//   const onChangeDescription = (e: string) => {
//     updateExam({ description: e });
//   };

//   const onDropdown = (v: string) => {
//     updateExam({ status: v as Status });
//     console.log("onDropdown: ", v);
//   };

//   return (
//     <CardExam className="w-full">
//       <div className="flex gap-3">
//         <div className="flex flex-col flex-grow">
//           <label>Tên môn thi</label>
//           <InputAnswer
//             value={topic}
//             name="topic"
//             key="topic"
//             onChange={(values) => {
//               setTopic(values);
//               if (onChangeTopic) {
//                 onChangeTopic(values);
//               }
//             }}
//             style="rounded-md"
//             placeholder="Nhập tên môn..."
//           />
//         </div>
//         <div className="flex">
//           <Dropdown
//             label="Trạng thái"
//             defaultValue={valueDropdown}
//             item={statusArray}
//             onValueChange={onDropdown}
//           />
//           <Timestamp
//             name="examTime"
//             defaultValue={valueExamTime}
//             onTimeChange={(timestamp) => {
//               console.log("timestamp: ", timestamp);
//               onChangeExamTime(timestamp);
//             }}
//           />
//         </div>
//       </div>
//       <div className="flex">
//         <InputAnswer
//           value={description}
//           name="description"
//           key="description"
//           onChange={(values) => {
//             setDescription(values);
//             if (onChangeDescription) {
//               onChangeDescription(values);
//             }
//           }}
//           style="rounded-md mt-3"
//           placeholder="Nhập tên môn..."
//         />
//       </div>
//     </CardExam>
//   );
// };

/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable react/prop-types */
import { Button } from 'rsuite'

// 수정, 삭제 버튼
// 사용예시) onClick={() => ~}
// {...rest} => style, className, disabled, type 등 나머지 속성들을 자동으로 전달함.
export default function Btn({ size="xs", color="blue", text, onClick, ...rest }) {
  return(
    <Button size={size} appearance='ghost' color={color}
      onClick={onClick} {...rest}>
      {text}
    </Button>
  )
}

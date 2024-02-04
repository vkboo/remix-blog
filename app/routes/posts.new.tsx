import { Button, Input, Textarea } from "@nextui-org/react";

export default function App() {
    return (
        <div>
            <div className="flex flex-col gap-3 p-12">
                <h1 className="text-xl font-black">发布文章</h1>
                <Input name="slug" label="slug" />
                <Input label="文章标题" />
                <Textarea label="内容" />
                <Button>
                    发布
                </Button>
            </div>
        </div>
    );
}

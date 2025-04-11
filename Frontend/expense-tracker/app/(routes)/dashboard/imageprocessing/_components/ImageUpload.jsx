"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { db } from "@/utils/dbConfig";
import { Expenses, Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { eq, sql } from "drizzle-orm";
const ImageUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [response, setResponse] = useState([]);
    const [error, setError] = useState(null);
    const [editingExpense, setEditingExpense] = useState(null);
    const currentMonth = new Date().getMonth() + 1;
    const [budgetList, setBudgetList] = useState([])
    
    const { user } = useUser();
const user_id = user?.id; // ✅ Fix: Use optional chaining

    
    useEffect(() => {
        const fetchBudgetList = async () => {
            if (!user) return;
            try {
                const currentMonth = new Date().getMonth() + 1;  
                console.log("from image upload")
                //console.log(user.id)
                    const budgets = await db.select({  
                        id: Budgets.id,  
                        name: Budgets.name,  
                    }).from(Budgets)  
                    .where(eq(Budgets.createdBy, user_id))  // ✅ Fix: Use `user.id`
                    .where(sql`EXTRACT(MONTH FROM ${Budgets.createdAt})::integer = ${currentMonth}`)  
                    .groupBy(Budgets.id);  
                    console.log(budgets)
                    setBudgetList(budgets)
            } catch (err) {
                console.error("Error fetching budgets:", err);
            }
        };
        fetchBudgetList();
    }, []);
    //console.log(user)
    // ✅ Create budget mapping only after budgetList is available
    const budgetMapping = Object.fromEntries(budgetList.map(b => [b.name, b.id]));
    console.log(budgetList)
    console.log(budgetMapping)
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResponse([]);
            setError(null);
        }
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setResponse([]);
        setError(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setError(null);

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async () => {
            const base64String = reader.result.split(",")[1];

            try {
                const res = await fetch("/api/extract", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ imageBase64: base64String }),
                });

                if (!res.ok) {
                    throw new Error("Failed to process the receipt.");
                }

                const rawData = await res.json();

                // ✅ Ensure rawData.data is a string before applying replace
                const responseText = typeof rawData.data === "string" ? rawData.data : JSON.stringify(rawData.data);
                let cleanData = responseText.replace(/^```json\n|\n```$/g, "");

                const parsedData = JSON.parse(cleanData);
                setResponse(parsedData.items || []);

            } catch (err) {
                setError(err.message || "An error occurred.");
            } finally {
                setUploading(false);
            }
        };
    };

    const handleEditExpense = (index, field, value) => {
        setResponse((prev) => {
            const updated = [...prev];

            if (field === "category" && budgetMapping[value]) {
                // ✅ If category (budget name) changes, update the corresponding budgetId
                updated[index].budgetId = budgetMapping[value];
            }

            updated[index][field] = value;
            return updated;
        });
    };


    const addNewExpense = async (expense) => {
        try {
            const result = await db.insert(Expenses).values({
                name: expense.name,
                amount: expense.amount,
                budgetId: expense.budgetId,
                createdAt: new Date(),
                createdBy: user.id
            }).returning({ insertedId: Budgets.id });

            if (result) {
                setResponse((prev) => prev.filter((item) => item !== expense));
                toast("New Expense Added");
            }
        } catch (err) {
            console.error("Error adding expense:", err);
        }
    };

    return (
        <div className="text-center p-5 max-w-sm mx-auto border rounded-lg shadow-lg">
            <input type="file" accept="image/*" onChange={handleFileChange} className="block mx-auto my-2" />
            {previewUrl && (
                <div className="relative">
                    <img src={previewUrl} alt="Preview" className="w-full max-h-48 object-cover mt-2 rounded" />
                    <button onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full">
                        <X size={16} />
                    </button>
                </div>
            )}
            <button onClick={handleUpload} disabled={!selectedFile || uploading} className="bg-blue-500 text-white px-4 py-2 rounded mt-3">
                {uploading ? "Uploading..." : "Upload"}
            </button>

            {error && <p className="mt-3 text-red-500">{error}</p>}

            {response.length > 0 && (
                <div className="mt-3 text-left bg-gray-100 p-3 rounded">
                    <h3 className="font-bold">Extracted Items:</h3>
                    {response.map((item, index) => (
                        <div key={index} className="bg-white p-3 my-2 rounded shadow">
                            <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleEditExpense(index, "name", e.target.value)}
                                className="border p-1 w-full rounded"
                            />
                            <input
                                type="number"
                                value={item.amount}
                                onChange={(e) => handleEditExpense(index, "amount", e.target.value)}
                                className="border p-1 w-full rounded mt-2"
                            />
                            <input
                                type="text"
                                value={item.category}
                                onChange={(e) => handleEditExpense(index, "category", e.target.value)}
                                className="border p-1 w-full rounded mt-2"
                            />
                            <div className="flex justify-between mt-2">
                                <button onClick={() => addNewExpense(item)} className="bg-green-500 text-white px-3 py-1 rounded">Accept</button>
                                <button onClick={() => setResponse((prev) => prev.filter((_, i) => i !== index))} className="bg-red-500 text-white px-3 py-1 rounded">Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;

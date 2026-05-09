<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
           "concept"=> ['required', 'string'],
            "amount" => ['required', 'string'],
            "date" => ['required', 'date'],
            "paytype"=> ['nullable', 'string'],
             "status" => ['required', 'string'],
            "ref" => ['nullable', 'string'],
            "contract_id" => ['required', 'string']
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ContractRequest extends FormRequest
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
            'buyer_id' => ['required', 'integer'],
            'seller_id' => ['required', 'integer'],
            'agent_id' => ['required', 'integer'],
            'property_id' => ['nullable', 'integer'],
            'plazo' => ['nullable', 'integer'],
            'paytype' => ['nullable', 'integer'],
            'ref' => ['nullable', 'string'],
            'advance' => ['nullable', 'double'],
            'date' => ['nullable', 'date']
        ];
    }
}
